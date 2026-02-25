import { Router } from "express";
import { findOrCreateUser, updateUserProfile } from "../services/users";

export const usersRouter = Router();

usersRouter.get("/me", async (req, res) => {
  const clerkId = req.auth?.clerkId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
  const user = await findOrCreateUser(clerkId);
  res.json(user);
});

usersRouter.patch("/me", async (req, res) => {
  const clerkId = req.auth?.clerkId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
  const user = await updateUserProfile(clerkId, req.body ?? {});
  res.json(user);
});

