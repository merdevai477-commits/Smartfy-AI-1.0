import { Router } from "express";
import { Buffer } from "buffer";
import rateLimit from "express-rate-limit";
import {
  createConversation,
  listConversations,
  findConversationByIdAndUser,
  touchConversation,
} from "../services/conversations";
import { createMessage, findLastN, listMessages, checkImageUploadLimit } from "../services/messages";
import { generateStreamingResponse } from "../services/groq";
import { findOrCreateUser } from "../services/users";

export const conversationsRouter = Router();

// ─── Rate Limiter For Message Streaming ─────────────────────────────
const messageLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 20, // 20 streamed messages per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: "لقد تجاوزت الحد المسموح للرسائل الآن. حاول مرة أخرى بعد دقيقة.",
      code: "MESSAGE_RATE_LIMITED",
    });
  },
});

conversationsRouter.post("/", async (req, res) => {
  const clerkId = req.auth?.clerkId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
  const title = typeof req.body?.title === "string" ? req.body.title : undefined;
  const conv = await createConversation(clerkId, title);
  res.json(conv);
});

conversationsRouter.get("/", async (req, res) => {
  const clerkId = req.auth?.clerkId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
  const list = await listConversations(clerkId);
  res.json(list);
});

conversationsRouter.get("/:id", async (req, res) => {
  const clerkId = req.auth?.clerkId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
  const id = req.params.id as string;
  const conv = await findConversationByIdAndUser(id, clerkId);
  if (!conv) return res.json({ conversation: null, messages: [] });
  const messages = await listMessages(id);
  res.json({ conversation: conv, messages });
});

conversationsRouter.post("/:id/messages", messageLimiter, async (req, res) => {
  const clerkId = req.auth?.clerkId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
  const id = req.params.id as string;

  const conv = await findConversationByIdAndUser(id, clerkId);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });

  const content = typeof req.body?.content === "string" ? req.body.content : "";
  const imageData = typeof req.body?.imageData === "string" ? req.body.imageData : undefined;
  const imageMimeType = typeof req.body?.imageMimeType === "string" ? req.body.imageMimeType : undefined;

  if (!content.trim() && !imageData) {
    return res.status(400).json({ error: "content is required" });
  }

  let imageSizeBytes = 0;
  if (imageData) {
    imageSizeBytes = Buffer.byteLength(imageData, "base64");
    const limit = await checkImageUploadLimit(clerkId, imageSizeBytes);
    if (!limit.ok) {
      return res.status(413).json({
        message:
          "لقد استنفدت الحد الأقصى لرفع الصور اليوم (10 ميجابايت). You have reached the daily image upload limit (10MB).",
        error: "UPLOAD_LIMIT_EXCEEDED",
      });
    }
  }

  await createMessage({
    conversationId: id,
    clerkId,
    role: "user",
    content,
    imageData,
    imageMimeType,
    imageSizeBytes,
  });

  await touchConversation(id);

  const history = await findLastN(id, 10);
  const user = await findOrCreateUser(clerkId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    const generator = generateStreamingResponse(
      content,
      history.map((m) => ({ role: m.role, content: m.content })),
      {
        name: user.name ?? undefined,
        brandName: (user as any).brandName ?? undefined,
        address: (user as any).address ?? undefined,
        tone: (user as any).tone ?? undefined,
      },
    );

    let fullAssistantResponse = "";
    for await (const chunk of generator) {
      fullAssistantResponse += chunk;
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    await createMessage({
      conversationId: id,
      clerkId,
      role: "assistant",
      content: fullAssistantResponse,
    });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "عذراً، حدث خطأ أثناء معالجة طلبك." })}\n\n`);
    res.end();
  }
});

