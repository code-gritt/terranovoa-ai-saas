"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Project = {
  id: string;
  name: string;
  location: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  userId: string;
};

export default function AIInsights({ projects }: { projects: Project[] }) {
  const [insights, setInsights] = useState<string>("Loading insights...");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
      <p className="text-gray-400">{insights}</p>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
