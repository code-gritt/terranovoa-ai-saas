import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { db } from "@/server/db";
import { projects, users } from "@/server/schema";
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch user data on the server
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user) {
    redirect("/login");
  }

  // Fetch user projects on the server
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id));

  // Pass data as props to the client component
  return <DashboardClient initialUser={user} initialProjects={userProjects} />;
}
