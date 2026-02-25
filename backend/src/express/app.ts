import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { initMongo } from "./db/mongo";
import { healthRouter } from "./routes/health";
import { usersRouter } from "./routes/users";
import { conversationsRouter } from "./routes/conversations";
import { clerkAuth } from "./middleware/clerkAuth";
import { requestLogger } from "./middleware/requestLogger";

function buildAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) return ["https://smartfyai.com", "https://www.smartfyai.com"];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    }),
  );
  app.use(compression());

  // ─── Global Rate Limiting ─────────────────────────────────────────
  const globalLimiter = rateLimit({
    windowMs: 60_000, // 1 minute
    max: 100, // 100 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      // Generic, localization-friendly message
      res.status(429).json({
        error: "Too many requests. Please slow down and try again shortly.",
        code: "RATE_LIMITED",
      });
    },
  });

  app.use(globalLimiter);

  const allowedOrigins = buildAllowedOrigins();
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
          return cb(null, true);
        }
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "X-API-Key"],
      maxAge: 86400,
    }),
  );

  app.use(express.json({ limit: "15mb" }));
  app.use(requestLogger);

  // Health + base
  app.get("/", (_req, res) => res.json({ status: "ok" }));
  app.use("/health", healthRouter);

  // DB (MongoDB)
  await initMongo();

  // Versioned API
  const api = express.Router();
  api.use(clerkAuth);
  api.use("/users", usersRouter);
  api.use("/conversations", conversationsRouter);
  app.use("/api/v1", api);

  const port = parseInt(process.env.PORT || "3000", 10);
  const host = "0.0.0.0";

  return {
    app,
    start: async () =>
      new Promise<void>((resolve) => {
        app.listen(port, host, () => {
          // eslint-disable-next-line no-console
          console.log(`[express] listening on http://${host}:${port}`);
          resolve();
        });
      }),
  };
}

