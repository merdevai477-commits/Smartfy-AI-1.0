import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Conversation } from "./Conversation";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column("uuid")
  conversationId!: string;

  @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversationId" })
  conversation!: Conversation;

  @Index()
  @Column({ type: "varchar", length: 191 })
  clerkId!: string;

  @Column({ type: "varchar", length: 20 })
  role!: "user" | "assistant";

  @Column("text")
  content!: string;

  @Column("text", { nullable: true })
  imageData!: string | null;

  @Column({ type: "varchar", length: 191, nullable: true })
  imageMimeType!: string | null;

  @Column({ type: "int", default: 0 })
  imageSizeBytes!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

