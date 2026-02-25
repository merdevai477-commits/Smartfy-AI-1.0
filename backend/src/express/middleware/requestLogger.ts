import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = req.headers["x-request-id"]
    ? String(req.headers["x-request-id"])
    : uuidv4();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const { method, url } = req;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Basic structured log for the incoming request
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      type: "request",
      requestId,
      method,
      url,
      ip,
      time: new Date().toISOString(),
    }),
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        type: "response",
        requestId,
        method,
        url,
        statusCode: res.statusCode,
        durationMs: duration,
        time: new Date().toISOString(),
      }),
    );
  });

  res.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        type: "error",
        requestId,
        method,
        url,
        message: err?.message || "Unknown error",
        stack: err?.stack,
        time: new Date().toISOString(),
      }),
    );
  });

  next();
}

