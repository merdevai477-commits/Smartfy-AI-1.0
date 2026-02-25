import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageRole = 'user' | 'assistant';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true, type: String, index: true })
  conversationId: string;

  @Prop({ required: true, type: String, index: true })
  clerkId: string;

  @Prop({ required: true, enum: ['user', 'assistant'], index: true })
  role: MessageRole;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: String, required: false })
  imageData?: string; // base64 encoded image (max 20MB)

  @Prop({ type: String, required: false })
  imageMimeType?: string; // e.g., "image/jpeg"

  @Prop({ type: Number, required: false, default: 0 })
  imageSizeBytes?: number; // Tracks size of uploaded image for daily limit

  @Prop({ type: Boolean, default: false })
  partial: boolean; // true if stream was interrupted

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Compound indexes for efficient queries
MessageSchema.index({ conversationId: 1, createdAt: -1 }); // Primary query pattern
MessageSchema.index({ conversationId: 1, role: 1 });
MessageSchema.index({ partial: 1 }); // For cleanup/monitoring
