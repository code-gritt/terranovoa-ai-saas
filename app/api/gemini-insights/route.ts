import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Project = {
  id: string;
  name: string;
  location: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  userId: string;
};

export async function POST(request: Request) {
  try {
    const { projects }: { projects: Project[] } = await request.json();
    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Projects array is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      "AIzaSyDqxbID4YBbRnVrVMfvuAgRLAyrjG-hs48"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const projectSummary = projects
      .map(
        (p) =>
          `Project: ${p.name}, Location: ${p.location}, Status: ${p.status}`
      )
      .join("\n");
    const prompt = `You are an environmental project analyst. Based on the following projects, provide concise AI-driven insights (max 100 words) for optimizing renewable energy or environmental impact. Include specific recommendations based on locations and statuses.\n\n${projectSummary}\n\nInsights:`;

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
      { error: "Failed to generate insights." },
      { status: 500 }
    );
  }
}
