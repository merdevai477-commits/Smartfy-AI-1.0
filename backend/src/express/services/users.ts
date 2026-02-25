import { UserModel } from "../db/models";

export type UpdateProfileBody = Partial<
  Pick<
    {
      name?: string;
      email?: string;
      country?: string;
      preferredLanguage?: string;
      fieldOfInterest?: string;
      plan: string;
      brandName?: string;
      address?: string;
      tone?: string;
    },
    | "name"
    | "email"
    | "country"
    | "preferredLanguage"
    | "fieldOfInterest"
    | "plan"
    | "brandName"
    | "address"
    | "tone"
  >
>;

export async function findOrCreateUser(clerkId: string) {
  let user = await UserModel.findOne({ clerkId }).lean().exec();
  if (!user) {
    const created = await UserModel.create({ clerkId });
    user = created.toObject() as any;
  }
  return user;
}

export async function updateUserProfile(clerkId: string, data: UpdateProfileBody) {
  await UserModel.updateOne({ clerkId }, { $set: data }).exec();
  return findOrCreateUser(clerkId);
}

