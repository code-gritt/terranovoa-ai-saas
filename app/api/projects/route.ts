import { db } from "@/server/db";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm"; // Ensure this import is present
import { projects } from "@/server/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId));

  return NextResponse.json(userProjects);
}

export async function POST(request: Request) {
  try {
    const { name, location, status, userId, milestones } = await request.json();

    if (!name || !location || !status || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new project with milestones
    const newProject = await db
      .insert(projects)
      .values({
        name,
        location,
        status,
        userId,
        milestones: milestones || [], // Default to empty array if not provided
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
