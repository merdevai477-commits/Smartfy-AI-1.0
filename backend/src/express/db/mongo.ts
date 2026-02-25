import mongoose from "mongoose";

let isConnected = false;

export async function initMongo() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required (MongoDB connection string).");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  isConnected = true;
  // eslint-disable-next-line no-console
  console.log("[mongo] connected");
}

