import { sql } from "drizzle-orm";
import { pgTable, text, pgEnum, timestamp, jsonb } from "drizzle-orm/pg-core";

export const SkillLevelEnum = pgEnum("skill_level", [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName"),
  lastName: text("lastName"),
  location: text("location"),
  email: text("email").notNull(),
  image: text("image").default("no-image"),
  password: text("password"),
  skillLevel: SkillLevelEnum("skill_level").notNull().default("Beginner"),
});

export const ProjectStatusEnum = pgEnum("project_status", [
  "Planning",
  "Active",
  "Completed",
  "On Hold",
]);

export const projects = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  status: ProjectStatusEnum("status").notNull().default("Planning"),
  location: text("location").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  milestones: jsonb("milestones").default(sql`'[]'::jsonb`), // New column for milestones
});
