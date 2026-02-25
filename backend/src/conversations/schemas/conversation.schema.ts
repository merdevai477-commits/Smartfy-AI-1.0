import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  // Store Clerk user ID as a plain string (not ObjectId)
  @Prop({ required: true, type: String, index: true })
  clerkId: string;

  @Prop({ required: false, trim: true, default: 'New conversation' })
  title: string;

  // Timestamps automatically managed by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Add virtual 'id' field that maps to '_id'
ConversationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtuals are included when converting to JSON
ConversationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

ConversationSchema.set('toObject', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    return ret;
  }
});

// Index for efficient queries per user, most recent first
ConversationSchema.index({ clerkId: 1, updatedAt: -1 });
