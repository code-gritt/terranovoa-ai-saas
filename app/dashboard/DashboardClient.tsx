"use client";

import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
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
    const counts: {
      Planning: number;
      Active: number;
      Completed: number;
      "On Hold": number;
    } = {
      Planning: 0,
      Active: 0,
      Completed: 0,
      "On Hold": 0,
    };

    for (const project of projects) {
      if (
        project.status === "Planning" ||
        project.status === "Active" ||
        project.status === "Completed" ||
        project.status === "On Hold"
      ) {
        counts[project.status]++;
      }
    }

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            User Overview
          </h2>
          <p className="text-gray-400">Welcome, {user.firstName || "User"}!</p>
          <p className="text-gray-400">Email: {user.email}</p>
          <p className="text-gray-400">Location: {user.location || "N/A"}</p>
          <p className="text-gray-400">Skill Level: {user.skillLevel}</p>
        </div>

        {/* Project Statistics */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            Project Stats
          </h2>
          <p className="text-gray-400">Total Projects: {projectCount}</p>
          <div className="mt-4 h-48">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Geospatial Map */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-64">
          <h2 className="text-xl font-semibold text-white mb-2">
            Project Locations
          </h2>
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
            {projects.map(
              (project: {
                location: string;
                id: Key | null | undefined;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                status:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
              }) => {
                const [lat, lon] = project.location.split(",").map(Number) || [
                  0, 0,
                ];
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
              }
            )}
          </MapContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white mb-2">AI Insights</h2>
        <p className="text-gray-400">
          Based on your projects, AI suggests optimizing solar farms in
          Bangalore with an estimated 15% efficiency gain using current weather
          patterns.
        </p>
        <p className="text-gray-400 mt-2">
          (Note: This is a mock insight. Future updates will integrate real-time
          AI analysis.)
        </p>
      </div>
    </div>
  );
}
