import { Body, Controller, Get, Param, Post, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AddMessageDto } from './dto/add-message.dto';

import { MessagesService } from '../messages/messages.service';
import { GeminiService } from '../gemini/gemini.service';

@Controller('conversations')
@UseGuards(ClerkAuthGuard)
export class ConversationsController {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly messagesService: MessagesService,
        private readonly geminiService: GeminiService,
    ) { }

    @Post()
    async create(
        @CurrentUser() clerkId: string,
        @Body() dto: CreateConversationDto,
    ) {
        console.log('=== 📝 CREATE CONVERSATION REQUEST ===');
        console.log('Clerk ID:', clerkId);
        console.log('Title:', dto.title || 'untitled');
        const conversation = await this.conversationsService.create(clerkId, dto.title || '');
        console.log('✅ Conversation created:', (conversation as any).id || conversation._id);
        console.log('Full conversation object:', JSON.stringify(conversation));
        console.log('=== END CREATE CONVERSATION ===\n');
        return conversation;
    }

    @Get()
    async list(@CurrentUser() clerkId: string) {
        return this.conversationsService.findByUser(clerkId);
    }

    /**
     * One-time migration: update titles of all untitled conversations
     * from their first user message content.
     */
    @Post('migrate-titles')
    async migrateTitles(@CurrentUser() clerkId: string) {
        const updated = await this.conversationsService.migrateTitles(clerkId);
        return { updated };
    }

    @Get(':id')
    async getOne(@Param('id') id: string, @CurrentUser() clerkId: string) {
        const conv = await this.conversationsService.findByIdAndUser(id, clerkId);
        if (!conv) return { conversation: null, messages: [] };
        const messages = await this.messagesService.findByConversation(id);
        return { conversation: conv, messages };
    }

    @Post(':id/messages')
    async addMessage(
        @Param('id') id: string,
        @CurrentUser() clerkId: string,
        @Body() dto: AddMessageDto,
        @Res() res: any, // Express Response
    ) {
        console.log('=== 📨 NEW MESSAGE REQUEST ===');
        console.log('Conversation ID:', id);
        console.log('Clerk ID:', clerkId);
        console.log('Message Content:', dto.content);
        console.log('Has Image:', !!dto.imageData);
        console.log('Image MIME Type:', dto.imageMimeType || 'N/A');

        // 1. Check Image limit if image is present
        if (dto.imageData) {
            console.log('🖼️ Checking image upload limit...');
            // Rough size estimation for base64
            const imageSize = Buffer.byteLength(dto.imageData, 'base64');
            console.log('Image Size:', imageSize, 'bytes');
            const isWithinLimit = await this.messagesService.checkImageUploadLimit(clerkId, imageSize);

            if (!isWithinLimit) {
                console.log('❌ Image upload limit exceeded');
                return res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
                    message: 'لقد استنفذت الحد الأقصى لرفع الصور اليوم (10 ميجابايت).',
                    error: 'Upload Limit Exceeded'
                });
            }
            console.log('✅ Image upload limit OK');
            // Temporarily store size for saving later
            dto.imageSizeBytes = imageSize;
        }

        // 2. Save user message
        console.log('💾 Saving user message to database...');
        const savedUserMessage = await this.messagesService.create({
            conversationId: id,
            clerkId,
            role: 'user',
            content: dto.content,
            imageData: dto.imageData,
            imageMimeType: dto.imageMimeType,
            imageSizeBytes: dto.imageSizeBytes
        });
        console.log('✅ User message saved with ID:', savedUserMessage._id || 'N/A');

        // Update conversation touch time + auto-generate title from first message
        await this.conversationsService.touch(id);

        // Auto-title: if conversation still has default title, set it from first user message
        const conv = await this.conversationsService.findById(id);
        if (conv && (!conv.title || conv.title === 'New conversation')) {
            const autoTitle = dto.content.length > 50
                ? dto.content.substring(0, 47) + '...'
                : dto.content;
            await this.conversationsService.updateTitle(id, autoTitle);
        }

        // 3. Get history
        console.log('📚 Fetching conversation history...');
        const history = await this.messagesService.findLastN(id, 10);
        console.log('✅ Retrieved', history.length, 'messages from history');

        // 4. Setup SSE for streaming response
        console.log('🌊 Setting up SSE stream...');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Necessary for some proxy setups
        res.flushHeaders();
        console.log('✅ SSE headers sent');

        try {
            console.log('🤖 Calling Gemini API...');
            const generator = this.geminiService.generateStreamingResponse(
                dto.content,
                history,
                dto.imageData,
                dto.imageMimeType
            );

            let fullAssistantResponse = '';
            let chunkCount = 0;

            for await (const chunk of generator) {
                chunkCount++;
                fullAssistantResponse += chunk;
                // Emit event
                res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
                if (chunkCount === 1) {
                    console.log('✅ First chunk received from Gemini');
                }
            }

            console.log('✅ Gemini streaming completed. Total chunks:', chunkCount);
            console.log('📝 Full response length:', fullAssistantResponse.length, 'characters');

            // Save assistant message when done
            console.log('💾 Saving assistant response to database...');
            const savedAssistantMessage = await this.messagesService.create({
                conversationId: id,
                clerkId,
                role: 'assistant',
                content: fullAssistantResponse
            });
            console.log('✅ Assistant message saved with ID:', savedAssistantMessage._id || 'N/A');

            // Signal stream end
            res.write(`data: [DONE]\n\n`);
            res.end();
            console.log('=== ✅ MESSAGE REQUEST COMPLETED ===\n');

        } catch (error: any) {
            console.error('=== ❌ STREAMING ERROR ===');
            console.error('Error Type:', error.constructor.name);
            console.error('Error Message:', error.message);
            console.error('Error Stack:', error.stack);
            console.error('=========================\n');
            // If stream hasn't started sending data, we might be able to send an error JSON, 
            // but since headers are flushed, we just write an error event.
            res.write(`data: ${JSON.stringify({ error: 'عذراً، حدث خطأ أثناء معالجة طلبك.' })}\n\n`);
            res.end();
        }
    }
}
