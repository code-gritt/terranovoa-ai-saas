import { NextResponse } from "next/server";
import { Parser } from "json2csv";

type Project = {
  id: string;
  name: string;
  location: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  userId: string;
  milestones: {
    name: string;
    targetDate: string;
    completionPercentage: number;
  }[];
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      console.error("No userId provided in request");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch projects dynamically from the existing API endpoint
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000" ||
      "https://terranovoa-ai.vercel.app";
    const projectsResponse = await fetch(
      `${apiUrl}/api/projects?userId=${userId}`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );

    if (!projectsResponse.ok) {
      console.error(
        `Failed to fetch projects: ${
          projectsResponse.status
        } - ${await projectsResponse.text()}`
      );
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: projectsResponse.status }
      );
    }

    const projects: Project[] = await projectsResponse.json();

    if (!projects || projects.length === 0) {
      console.warn(`No projects found for userId: ${userId}`);
      return NextResponse.json(
        { error: "No projects available for export" },
        { status: 404 }
      );
    }

    // Flatten milestones into the project data for CSV
    const flattenedProjects = projects.map((project) => ({
      ...project,
      milestones: project.milestones
        .map((m) => `${m.name} (${m.targetDate}: ${m.completionPercentage}%)`)
        .join(", "),
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(flattenedProjects);

    // Set response headers for CSV download
    const headers = {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="TerraNova_Projects_${
        new Date().toISOString().split("T")[0]
      }.csv"`,
    };

    return new NextResponse(csv, { headers });
  } catch (error: any) {
    console.error("Export API error:", error.message || error);
    return NextResponse.json(
      { error: "Failed to generate CSV export.", details: error.message },
      { status: 500 }
    );
  }
}
