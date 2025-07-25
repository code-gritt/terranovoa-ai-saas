import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { projects, users } from "@/server/schema";

type Milestone = {
  name: string;
  targetDate: string;
  completionPercentage: number;
};

type Project = {
  id: string;
  name: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  location: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  milestones: Milestone[];
};

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user) {
    redirect("/login");
  }

  // Fetch and normalize user projects with error handling
  let rawProjects: any[];
  try {
    rawProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    rawProjects = []; // Fallback to empty array on error
  }

  const userProjects: Project[] = rawProjects.map((project) => {
    // Safely handle milestones, ensuring it's an array
    const milestonesData = project.milestones;
    const milestones: Milestone[] = Array.isArray(milestonesData)
      ? milestonesData
      : typeof milestonesData === "object" && milestonesData !== null
      ? Object.values(milestonesData)
      : [];

    return {
      ...project,
      milestones: milestones.map((m) => ({
        name: m.name || "",
        targetDate: m.targetDate || "",
        completionPercentage: m.completionPercentage || 0,
      })),
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };
  });

  return <DashboardClient initialUser={user} initialProjects={userProjects} />;
}
