import { MessageModel } from "../db/models";

export type CreateMessageDto = {
  conversationId: string;
  clerkId: string;
  role: "user" | "assistant";
  content: string;
  imageData?: string;
  imageMimeType?: string;
  imageSizeBytes?: number;
};

export async function createMessage(dto: CreateMessageDto) {
  const msg = await MessageModel.create({
    conversationId: dto.conversationId,
    clerkId: dto.clerkId,
    role: dto.role,
    content: dto.content,
    imageData: dto.imageData ?? null,
    imageMimeType: dto.imageMimeType ?? null,
    imageSizeBytes: dto.imageSizeBytes ?? 0,
    partial: false,
  });
  const obj = msg.toObject();
  return { ...obj, id: obj._id.toString() };
}

export async function listMessages(conversationId: string) {
  const docs = await MessageModel.find({ conversationId }).sort({ createdAt: 1 }).lean().exec();
  return docs.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
}

export async function findLastN(conversationId: string, limit: number) {
  const messages = await MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select({ imageData: 0 })
    .lean()
    .exec();
  const withId = messages.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
  return withId.reverse();
}

export async function checkImageUploadLimit(clerkId: string, incomingImageSize: number) {
  const MAX_BYTES_PER_DAY = 10 * 1024 * 1024;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const result = await MessageModel.aggregate<{
    _id: null;
    totalBytes: number;
  }>([
    {
      $match: {
        clerkId,
        createdAt: { $gte: startOfDay },
        imageSizeBytes: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        totalBytes: { $sum: "$imageSizeBytes" },
      },
    },
  ]);

  const currentTotal = result.length > 0 ? result[0].totalBytes : 0;
  const newTotal = currentTotal + incomingImageSize;

  return {
    ok: newTotal <= MAX_BYTES_PER_DAY,
    currentTotal,
    newTotal,
    limitBytes: MAX_BYTES_PER_DAY,
  };
}

