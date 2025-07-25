"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "../db";
import { projects } from "../schema";

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
      await db.insert(projects).values({
        id: crypto.randomUUID(),
        name,
        location,
        status,
        userId,
      });
      return { success: "Project created successfully" };
    } catch (error) {
      return { error: "Failed to create project" };
    }
  });
