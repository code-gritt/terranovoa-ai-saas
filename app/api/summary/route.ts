import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Project = {
  id: string;
  name: string;
  location: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  userId: string;
  milestones?: { targetDate: string; completionPercentage: number }[];
};

type WeatherData = {
  temperature?: number;
  precipitation?: number;
  forecast?: string;
};

export async function POST(request: Request) {
  try {
    const {
      projects,
      weatherData,
    }: { projects: Project[]; weatherData: WeatherData } = await request.json();
    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Projects array is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || "AIzaSyDqxbID4YBbRnVrVMfvuAgRLAyrjG-hs48"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Calculate project stats
    const statusCounts = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      { Planning: 0, Active: 0, Completed: 0, "On Hold": 0 }
    );
    const totalProjects = projects.length;
    const activePercentage = (
      (statusCounts.Active / totalProjects) *
      100
    ).toFixed(0);

    // Prepare weather context
    const weatherSummary = weatherData
      ? `Weather Conditions: Temperature ${
          weatherData.temperature || "N/A"
        }°C, Precipitation ${weatherData.precipitation || "N/A"}mm, Forecast ${
          weatherData.forecast || "N/A"
        }`
      : "No weather data available";

    const prompt = `You are an environmental project analyst for TerraNova AI. Generate a concise summary (max 100 words) of project stats and weather conditions. Include the percentage of active projects and any relevant weather insights. Data:\n- Total Projects: ${totalProjects}\n- Status Breakdown: Planning=${statusCounts.Planning}, Active=${statusCounts.Active}, Completed=${statusCounts.Completed}, On Hold=${statusCounts["On Hold"]}\n- Active Percentage: ${activePercentage}%\n${weatherSummary}\n\nSummary:`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error.status === 404) {
      return NextResponse.json(
        { error: "Gemini model not found. Check model name or API key." },
        { status: 404 }
      );
    }
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}
