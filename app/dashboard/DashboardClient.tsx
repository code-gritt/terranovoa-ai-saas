"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CreateProject from "@/components/CreateProject";
import Header from "@/components/Header";
import ClientWrapper from "@/components/client-wrapper";
import DataTable from "@/components/DataTable";
import AIInsights from "@/components/AIInsights";
import axios from "axios";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  location: string | null;
  email: string;
  image: string | null;
  password: string | null;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master";
};

type Project = {
  id: string;
  name: string;
  location: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  userId: string;
};

interface DashboardClientProps {
  initialUser: User;
  initialProjects: Project[];
}

export default function DashboardClient({
  initialUser,
  initialProjects,
}: DashboardClientProps) {
  const [user, setUser] = useState(initialUser);
  const [projects, setProjects] = useState(initialProjects);
  const [statusCounts, setStatusCounts] = useState({
    Planning: 0,
    Active: 0,
    Completed: 0,
    "On Hold": 0,
  });

  useEffect(() => {
    const counts = projects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      { Planning: 0, Active: 0, Completed: 0, "On Hold": 0 }
    );
    setStatusCounts(counts);
  }, [projects]);

  const chartData = {
    labels: ["Planning", "Active", "Completed", "On Hold"],
    datasets: [
      {
        label: "Projects",
        data: [
          statusCounts.Planning,
          statusCounts.Active,
          statusCounts.Completed,
          statusCounts["On Hold"],
        ],
        backgroundColor: ["#9333ea", "#06b6d4", "#10b981", "#f59e0b"],
        borderColor: ["#9333ea", "#06b6d4", "#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#d1d5db" } },
      title: { display: false },
    },
    scales: { y: { beginAtZero: true, ticks: { color: "#d1d5db" } } },
  };

  const refreshProjects = async () => {
    const response = await fetch(`/api/projects?userId=${user.id}`, {
      cache: "no-store",
    });
    const updatedProjects = await response.json();
    setProjects(updatedProjects);
  };

  return (
    <ClientWrapper>
      <div className="flex flex-col bg-gray-950 text-gray-100 min-h-screen">
        <Header />
        <section className="py-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Create Project */}
            <div className="flex justify-end mb-6">
              <CreateProject
                userId={user.id}
                onProjectCreated={refreshProjects}
              />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Overview */}
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2">User Overview</h2>
                <p className="text-gray-400">
                  Welcome, {user.firstName || "User"}!
                </p>
                <p className="text-gray-400">Email: {user.email}</p>
                <p className="text-gray-400">
                  Location: {user.location || "N/A"}
                </p>
                <p className="text-gray-400">Skill Level: {user.skillLevel}</p>
              </div>

              {/* Project Stats */}
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2">Project Stats</h2>
                <p className="text-gray-400">
                  Total Projects: {projects.length}
                </p>
                <div className="h-64 mt-4">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Map (spans 2 columns on mobile) */}
              <div className="md:col-span-2 rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2">Project Locations</h2>
                <div className="h-[400px] w-full">
                  <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    className="h-full w-full rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    {projects.map((project) => {
                      const [lat, lon] = project.location
                        ?.split(",")
                        .map(Number) || [0, 0];
                      return (
                        lat &&
                        lon && (
                          <Marker key={project.id} position={[lat, lon]}>
                            <Popup>
                              {project.name} <br /> Status: {project.status}
                            </Popup>
                          </Marker>
                        )
                      );
                    })}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Project List</h2>
              <DataTable data={projects} onProjectUpdated={refreshProjects} />
            </div>

            {/* AI Insights */}
            <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-2">AI Insights</h2>
              <AIInsights projects={projects} />
            </div>
          </div>
        </section>
      </div>
    </ClientWrapper>
  );
}
