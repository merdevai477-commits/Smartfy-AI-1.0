import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async findByClerkId(clerkId: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ clerkId }).exec();
    }

    async findOrCreate(clerkId: string, email?: string, name?: string): Promise<UserDocument> {
        let user = await this.findByClerkId(clerkId);

        if (!user) {
            user = new this.userModel({ clerkId, email, name });
            user = await user.save();
        }

        return user;
    }

    async updateProfile(clerkId: string, data: Partial<User>): Promise<UserDocument> {
        await this.userModel.updateOne({ clerkId }, { $set: data }).exec();
        return this.findByClerkId(clerkId) as Promise<UserDocument>;
    }
}
