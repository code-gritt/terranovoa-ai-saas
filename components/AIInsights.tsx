"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Project = {
  id: string;
  name: string;
  location: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  userId: string;
  milestones: { targetDate: string; completionPercentage: number }[];
};

type WeatherData = {
  temperature?: number;
  precipitation?: number;
  forecast?: string;
};

export default function AIInsights({ projects }: { projects: Project[] }) {
  const [insights, setInsights] = useState<string>("Loading insights...");
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("Generating summary...");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 30, // Example data
    precipitation: 5,
    forecast: "High temperatures expected next week",
  });

  useEffect(() => {
    if (!projects.length) {
      setInsights("No projects available for insights.");
      return;
    }

    const fetchInsights = async () => {
      try {
        const response = await axios.post("/api/gemini-insights", { projects });
        setInsights(response.data.text || "No insights generated.");
        setError(null);
      } catch (error: any) {
        console.error("Error fetching AI insights:", error);
        const errorMsg =
          error.response?.data?.error ||
          "Failed to fetch insights. Check console for details.";
        setInsights("No insights available.");
        setError(errorMsg);
      }
    };

    const timeout = setTimeout(fetchInsights, 1000); // Delay to simulate async
    return () => clearTimeout(timeout);
  }, [projects]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects, weatherData }),
        });
        const data = await response.json();
        if (data.error) {
          setSummary(data.error);
        } else {
          setSummary(data.text);
        }
      } catch (error) {
        setSummary("Error fetching summary. Please try again later.");
        console.error("Summary API error:", error);
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [projects, weatherData]);

  return (
    <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
      <h2 className="my-2">AI Insights</h2>

      <p className="text-gray-400">{insights}</p>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <h2 className="my-2">AI Summary</h2>
      <p className="text-gray-400">{summary}</p>
    </div>
  );
}
