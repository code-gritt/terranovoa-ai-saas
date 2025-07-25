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

// Fix Leaflet default icon issue
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
  const [projectCount, setProjectCount] = useState(initialProjects.length);
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
    setProjectCount(projects.length);
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

  const handleProjectCreated = async () => {
    const response = await fetch(`/api/projects?userId=${user.id}`, {
      cache: "no-store",
    });
    const updatedProjects = await response.json();
    setProjects(updatedProjects);
  };

  const handleProjectUpdated = async () => {
    const response = await fetch(`/api/projects?userId=${user.id}`, {
      cache: "no-store",
    });
    const updatedProjects = await response.json();
    setProjects(updatedProjects);
  };

  return (
    <ClientWrapper>
      <div className="flex flex-col bg-gray-950 text-gray-100 min-h-[11700px]">
        <Header />
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>
          <div className="container relative px-4 md:px-8">
            <div className="flex justify-end mb-6">
              <CreateProject
                userId={user.id}
                onProjectCreated={handleProjectCreated}
              />
            </div>
            <div
              className="grid gap-8"
              style={{
                gridTemplateColumns: "1fr 1fr",
                gridTemplateAreas: "'overview map' 'stats map'",
              }}
            >
              {/* User Overview */}
              <div
                style={{ gridArea: "overview" }}
                className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-900/50 hover:bg-gray-800/50"
              >
                <h2 className="mb-2 text-xl font-bold">User Overview</h2>
                <p className="text-gray-400">
                  Welcome, {user.firstName || "User"}!
                </p>
                <p className="text-gray-400">Email: {user.email}</p>
                <p className="text-gray-400">
                  Location: {user.location || "N/A"}
                </p>
                <p className="text-gray-400">Skill Level: {user.skillLevel}</p>
              </div>

              {/* Project Statistics */}
              <div
                style={{ gridArea: "stats" }}
                className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-900/50 hover:bg-gray-800/50"
              >
                <h2 className="mb-2 text-xl font-bold">Project Stats</h2>
                <p className="text-gray-400">Total Projects: {projectCount}</p>
                <div className="mt-4 h-48">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Geospatial Map */}
              <div
                style={{ gridArea: "map" }}
                className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-900/50 hover:bg-gray-800/50"
              >
                <h2 className="mb-2 text-xl font-bold">Project Locations</h2>
                <MapContainer
                  center={[20.5937, 78.9629]} // Centered on India
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  className="rounded-lg overflow-hidden"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {projects.map((project) => {
                    const [lat, lon] = project.location
                      .split(",")
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

            {/* Project Data Table */}
            <div className="mt-6">
              <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-900/50 hover:bg-gray-800/50">
                <h2 className="mb-4 text-xl font-bold">Project List</h2>
                <DataTable
                  data={projects}
                  onProjectUpdated={handleProjectUpdated}
                />
              </div>
            </div>

            {/* AI Insights */}
            <div className="mt-6 flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-900/50 hover:bg-gray-800/50">
              <h2 className="mb-2 text-xl font-bold">AI Insights</h2>
              <p className="text-gray-400">
                Based on your projects, AI suggests optimizing solar farms in
                Bangalore with an estimated 15% efficiency gain using current
                weather patterns.
              </p>
              <p className="text-gray-400 mt-2">
                (Note: This is a mock insight. Future updates will integrate
                real-time AI analysis.)
              </p>
            </div>
          </div>
        </section>
      </div>
    </ClientWrapper>
  );
}
