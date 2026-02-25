import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Message } from '../messages/schemas/message.schema';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectModel(Conversation.name)
        private readonly conversationModel: Model<Conversation>,
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>,
    ) { }

    /**
     * Create a new conversation for a Clerk user
     */
    async create(clerkId: string, title: string): Promise<Conversation> {
        const conversation = new this.conversationModel({
            clerkId,
            title: title || 'New conversation',
        });
        const saved = await conversation.save();
        // Convert to plain object with id field
        return saved.toObject({ virtuals: true });
    }

    /**
     * Update conversation's updatedAt timestamp
     * Called after each new message
     */
    async touch(conversationId: string): Promise<void> {
        await this.conversationModel.updateOne(
            { _id: conversationId },
            { $set: { updatedAt: new Date() } }
        );
    }

    /**
     * Update conversation title (used for auto-titling from first message)
     */
    async updateTitle(conversationId: string, title: string): Promise<void> {
        await this.conversationModel.updateOne(
            { _id: conversationId },
            { $set: { title } }
        );
    }

    /**
     * Find all conversations for a user (sorted by most recent)
     */
    async findByUser(clerkId: string): Promise<Conversation[]> {
        return this.conversationModel
            .find({ clerkId })
            .sort({ updatedAt: -1 })
            .exec();
    }

    /**
     * Find conversation by ID
     */
    async findById(conversationId: string): Promise<Conversation | null> {
        return this.conversationModel
            .findById(conversationId)
            .exec();
    }

    /**
     * Find conversation by ID and verify ownership
     */
    async findByIdAndUser(conversationId: string, clerkId: string): Promise<Conversation | null> {
        return this.conversationModel
            .findOne({
                _id: conversationId,
                clerkId,
            })
            .exec();
    }

    /**
     * Migrate old untitled conversations by fetching their first user message
     * and using it as the conversation title.
     */
    async migrateTitles(clerkId: string): Promise<number> {
        // Find all conversations with default/empty title
        const untitled = await this.conversationModel
            .find({
                clerkId,
                $or: [
                    { title: 'New conversation' },
                    { title: '' },
                    { title: null },
                ],
            })
            .lean()
            .exec();

        let updated = 0;
        for (const conv of untitled) {
            // Get the first user message for this conversation
            const firstMessage = await this.messageModel
                .findOne({ conversationId: String(conv._id), role: 'user' })
                .sort({ createdAt: 1 })
                .select('content')
                .lean()
                .exec();

            if (firstMessage?.content) {
                const title = firstMessage.content.length > 50
                    ? firstMessage.content.substring(0, 47) + '...'
                    : firstMessage.content;
                await this.conversationModel.updateOne(
                    { _id: conv._id },
                    { $set: { title } }
                );
                updated++;
            }
        }
        return updated;
    }
}
