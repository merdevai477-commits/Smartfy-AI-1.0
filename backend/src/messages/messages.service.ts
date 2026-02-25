import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

export interface CreateMessageDto {
    conversationId: string;
    clerkId: string;
    role: 'user' | 'assistant';
    content: string;
    imageData?: string;
    imageMimeType?: string;
    imageSizeBytes?: number;
    partial?: boolean;
}

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>,
    ) { }

    /**
     * Create a new message in MongoDB
     */
    async create(dto: CreateMessageDto): Promise<Message> {
        const message = new this.messageModel({
            conversationId: dto.conversationId,
            clerkId: dto.clerkId,
            role: dto.role,
            content: dto.content,
            imageData: dto.imageData,
            imageMimeType: dto.imageMimeType,
            imageSizeBytes: dto.imageSizeBytes || 0,
            partial: dto.partial || false,
        });
        return message.save();
    }

    /**
     * Fetch last N messages for a conversation (optimized query)
     * Returns messages in chronological order (oldest first)
     */
    async findLastN(conversationId: string, limit: number): Promise<Message[]> {
        const messages = await this.messageModel
            .find({ conversationId })
            .sort({ createdAt: -1 }) // DESC for efficient index usage
            .limit(limit)
            .select('-imageData') // Exclude large image data from context
            .exec();

        return messages.reverse(); // Reverse to oldest-first for Gemini API
    }

    /**
     * Check if user has exceeded their daily 10MB image upload limit
     */
    async checkImageUploadLimit(clerkId: string, incomingImageSize: number): Promise<boolean> {
        const MAX_BYTES_PER_DAY = 10 * 1024 * 1024; // 10MB

        // Find start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Sum image sizes for today
        const result = await this.messageModel.aggregate([
            {
                $match: {
                    clerkId,
                    createdAt: { $gte: startOfDay },
                    imageSizeBytes: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBytes: { $sum: '$imageSizeBytes' }
                }
            }
        ]);

        const currentTotal = result.length > 0 ? result[0].totalBytes : 0;
        return (currentTotal + incomingImageSize) <= MAX_BYTES_PER_DAY;
    }

    /**
     * Find all messages for a conversation (for UI display)
     */
    async findByConversation(conversationId: string): Promise<Message[]> {
        return this.messageModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .exec();
    }

    /**
     * Count partial messages (for monitoring)
     */
    async countPartial(): Promise<number> {
        return this.messageModel.countDocuments({ partial: true });
    }

    /**
     * Find message by ID
     */
    async findById(messageId: string): Promise<Message | null> {
        return this.messageModel
            .findById(messageId)
            .exec();
    }
}
