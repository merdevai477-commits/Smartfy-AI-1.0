import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 191 })
  clerkId!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 191, nullable: true })
  name!: string | null;

  @Column({ type: "varchar", length: 191, nullable: true })
  brandName!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  address!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  tone!: string | null;

  @Column({ type: "varchar", length: 50, default: "free" })
  plan!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country!: string | null;

  @Column({ type: "varchar", length: 10, nullable: true })
  preferredLanguage!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  fieldOfInterest!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

