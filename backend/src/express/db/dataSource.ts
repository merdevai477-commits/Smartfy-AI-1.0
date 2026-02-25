import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required (Supabase Postgres connection string).");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  ssl: { rejectUnauthorized: false },
  entities: [User, Conversation, Message],
  synchronize: process.env.SYNC_DB === "true",
  logging: process.env.NODE_ENV !== "production",
  extra: { connectionTimeoutMillis: 15000 },
});

export async function initDataSource() {
  if (AppDataSource.isInitialized) return AppDataSource;
  await AppDataSource.initialize();
  // eslint-disable-next-line no-console
  console.log("[db] connected");
  return AppDataSource;
}

