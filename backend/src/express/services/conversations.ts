import { ConversationModel } from "../db/models";

export async function createConversation(clerkId: string, title?: string): Promise<any> {
  const conv = await ConversationModel.create({
    clerkId,
    title: title?.trim() ? title.trim() : "New conversation",
  });
  const obj = conv.toObject();
  return { ...obj, id: obj._id.toString() };
}

export async function listConversations(clerkId: string): Promise<any[]> {
  const docs = await ConversationModel.find({ clerkId }).sort({ updatedAt: -1 }).lean().exec();
  return docs.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
}

export async function findConversationByIdAndUser(id: string, clerkId: string): Promise<any> {
  const doc = await ConversationModel.findOne({ _id: id, clerkId }).lean().exec();
  if (!doc) return null;
  return { ...doc, id: (doc as any)._id.toString() };
}

export async function touchConversation(id: string) {
  await ConversationModel.updateOne({ _id: id }, { $set: { updatedAt: new Date() } }).exec();
}

