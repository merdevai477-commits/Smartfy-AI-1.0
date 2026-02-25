import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      auth?: { clerkId: string };
    }
  }
}

const secretKey = process.env.CLERK_SECRET_KEY || "";

if (!secretKey && process.env.NODE_ENV !== "test") {
  // Fail fast if Clerk is not configured correctly
  // This avoids silently accepting tokens with an empty secret
  throw new Error("CLERK_SECRET_KEY is not configured. Set it in your backend environment.");
}

export async function clerkAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = await verifyToken(token, {
      secretKey,
      clockSkewInMs: 180000,
    });
    req.auth = { clerkId: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

