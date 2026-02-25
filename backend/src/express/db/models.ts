import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
  clerkId: string;
  email?: string;
  name?: string;
  plan: string;
  country?: string;
  preferredLanguage?: string;
  fieldOfInterest?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    name: { type: String },
    plan: { type: String, default: "free" },
    country: { type: String },
    preferredLanguage: { type: String },
    fieldOfInterest: { type: String },
  },
  { timestamps: true },
);

export const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export interface ConversationDocument extends Document {
  clerkId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument>(
  {
    clerkId: { type: String, required: true, index: true },
    title: { type: String, default: "New conversation", trim: true },
  },
  { timestamps: true },
);

ConversationSchema.index({ clerkId: 1, updatedAt: -1 });

export const ConversationModel: Model<ConversationDocument> =
  mongoose.models.Conversation ||
  mongoose.model<ConversationDocument>("Conversation", ConversationSchema);

export type MessageRole = "user" | "assistant";

export interface MessageDocument extends Document {
  conversationId: string;
  clerkId: string;
  role: MessageRole;
  content: string;
  imageData?: string;
  imageMimeType?: string;
  imageSizeBytes?: number;
  partial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    conversationId: { type: String, required: true, index: true },
    clerkId: { type: String, required: true, index: true },
    role: { type: String, required: true, enum: ["user", "assistant"], index: true },
    content: { type: String, required: true },
    imageData: { type: String },
    imageMimeType: { type: String },
    imageSizeBytes: { type: Number, default: 0 },
    partial: { type: Boolean, default: false },
  },
  { timestamps: true },
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, role: 1 });
MessageSchema.index({ partial: 1 });

export const MessageModel: Model<MessageDocument> =
  mongoose.models.Message ||
  mongoose.model<MessageDocument>("Message", MessageSchema);

