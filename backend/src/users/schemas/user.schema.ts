import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, required: true, unique: true, index: true })
    clerkId: string;

    @Prop({ type: String, required: false })
    email?: string;

    @Prop({ type: String, required: false })
    name?: string;

    @Prop({ type: String, required: false })
    brandName?: string;

    @Prop({ type: String, required: false })
    address?: string;

    @Prop({ type: String, required: false })
    tone?: string;

    @Prop({ type: String, default: 'free' })
    plan: string;

    @Prop({ type: String, required: false })
    country?: string;

    @Prop({ type: String, required: false })
    preferredLanguage?: string;

    @Prop({ type: String, required: false })
    fieldOfInterest?: string;

    @Prop({ type: [String], required: false })
    marketingTypes?: string[];

    @Prop({ type: String, required: false })
    phone?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
