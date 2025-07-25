"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "../db";
import { projects } from "../schema";
import { eq } from "drizzle-orm";

// Define the Project type based on the schema
type Project = typeof projects.$inferSelect;

export const deleteProjectAction = actionClient
  .schema(
    z.object({
      projectId: z.string().min(1, "Project ID is required"),
    })
  )
  .action(async ({ parsedInput: { projectId } }) => {
    try {
      await db.delete(projects).where(eq(projects.id, projectId));
      return { success: "Project deleted successfully" };
    } catch (error) {
      return { error: "Failed to delete project" };
    }
  });

export const createProjectAction = actionClient
  .schema(
    z.object({
      name: z.string().min(1, "Name is required"),
      location: z
        .string()
        .regex(
          /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
          "Invalid lat,lon format"
        ),
      status: z.enum(["Planning", "Active", "Completed", "On Hold"]),
      userId: z.string().min(1, "User ID is required"),
    })
  )
  .action(async ({ parsedInput: { name, location, status, userId } }) => {
    try {
      const result = await db
        .insert(projects)
        .values({
          name,
          location,
          status,
          userId,
        })
        .returning();
      return { success: "Project created successfully" };
    } catch (error) {
      return { error: "Failed to create project" };
    }
  });

export const updateProjectAction = actionClient
  .schema(
    z.object({
      projectId: z.string().min(1, "Project ID is required"),
      name: z.string().min(1, "Name is required"),
      location: z
        .string()
        .regex(
          /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
          "Invalid lat,lon format"
        ),
      status: z.enum(["Planning", "Active", "Completed", "On Hold"]),
    })
  )
  .action(async ({ parsedInput: { projectId, name, location, status } }) => {
    try {
      await db
        .update(projects)
        .set({
          name,
          location,
          status,
          updatedAt: new Date(), // Ensure this matches the schema's timestamp type
        })
        .where(eq(projects.id, projectId));
      return { success: "Project updated successfully" };
    } catch (error) {
      return { error: "Failed to update project" };
    }
  });
