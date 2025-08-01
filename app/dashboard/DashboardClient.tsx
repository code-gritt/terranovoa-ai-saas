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
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CreateProject from "@/components/CreateProject";
import Header from "@/components/Header";
import ClientWrapper from "@/components/client-wrapper";
import DataTable from "@/components/DataTable";
import AIInsights from "@/components/AIInsights";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import solarIrradianceData from "@/public/data/solar_irradiance.json" assert { type: "json" };
import windSpeedData from "@/public/data/wind_speed.json" assert { type: "json" };
import protectedAreasData from "@/public/data/protected_areas.json" assert { type: "json" };
import type { FeatureCollection } from "geojson";
import MapClickHandler from "@/components/MapClickHandler";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Bubble } from "@/components/bubble";

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

// Define Milestone and Project Types
type Milestone = {
  name: string;
  targetDate: string;
  completionPercentage: number;
};

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
  milestones: Milestone[];
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
  const [layers, setLayers] = useState({
    solarIrradiance: false,
    windSpeed: false,
    protectedAreas: false,
    weatherTemp: false,
    weatherPrecip: false,
  });
  const [newProjectCoords, setNewProjectCoords] = useState<
    [number, number] | null
  >(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

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

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    setNewProjectCoords([e.latlng.lat, e.latlng.lng]);
  };

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const generateDDR = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("TerraNova AI Report", 10, 10);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 20);
    doc.text(`User: ${user.firstName || "User"}`, 10, 30);
    doc.text(`Total Projects: ${projects.length}`, 10, 40);

    projects.forEach((project, index) => {
      const y = 50 + index * 10;
      doc.text(
        `${project.name} - ${project.status} - Location: ${project.location}`,
        10,
        y
      );
      project.milestones.forEach((milestone, mIndex) => {
        doc.text(
          `  Milestone: ${milestone.name} - ${milestone.targetDate} - ${milestone.completionPercentage}%`,
          15,
          y + (mIndex + 1) * 10
        );
      });
    });

    doc.save("TerraNova_Report.pdf");
  };

  const exportCSV = async () => {
    console.log("Exporting CSV for userId:", user.id); // Debug log
    const response = await fetch(`/api/export?userId=${user.id}`, {
      method: "GET", // Explicitly set method to GET
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TerraNova_Projects_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const errorText = await response.text();
      console.error("Failed to export CSV:", response.status, errorText);
      alert(
        `Failed to export CSV. Status: ${response.status}. Check console for details.`
      );
    }
  };

  const API_KEY = "82151bbbc5a82e1267c8a232bd09d99b";

  return (
    <ClientWrapper>
      <div className="flex flex-col bg-gray-950 text-gray-100 min-h-screen">
        <Header />
        <section className="py-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Create Project and Export/Generate Report Buttons */}
            <div className="flex justify-end mb-6 space-x-4">
              <Button
                onClick={exportCSV}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Export CSV
              </Button>
              <Button
                onClick={generateDDR}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate Report
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                  </DialogHeader>
                  <CreateProject
                    userId={user.id}
                    onProjectCreated={() => {
                      refreshProjects();
                      setNewProjectCoords(null);
                    }}
                    coordinates={
                      newProjectCoords
                        ? `${newProjectCoords[0]},${newProjectCoords[1]}`
                        : undefined
                    }
                    onMilestonesChange={(milestones: any) => {
                      console.log("Milestones updated:", milestones);
                    }}
                  />
                </DialogContent>
              </Dialog>
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

              {/* Map */}
              <div className="md:col-span-2 rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2">Project Locations</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="solarIrradiance"
                      checked={layers.solarIrradiance}
                      onCheckedChange={() => toggleLayer("solarIrradiance")}
                    />
                    <Label htmlFor="solarIrradiance">Solar Irradiance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="windSpeed"
                      checked={layers.windSpeed}
                      onCheckedChange={() => toggleLayer("windSpeed")}
                    />
                    <Label htmlFor="windSpeed">Wind Speed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="protectedAreas"
                      checked={layers.protectedAreas}
                      onCheckedChange={() => toggleLayer("protectedAreas")}
                    />
                    <Label htmlFor="protectedAreas">Protected Areas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="weatherTemp"
                      checked={layers.weatherTemp}
                      onCheckedChange={() => toggleLayer("weatherTemp")}
                    />
                    <Label htmlFor="weatherTemp">Temperature</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="weatherPrecip"
                      checked={layers.weatherPrecip}
                      onCheckedChange={() => toggleLayer("weatherPrecip")}
                    />
                    <Label htmlFor="weatherPrecip">Precipitation</Label>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    className="h-full w-full rounded-lg"
                  >
                    <MapClickHandler onClick={handleMapClick} />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    {projects.map((project) => {
                      const [lat, lon] = project.location
                        ?.split(",")
                        .map(Number) || [0, 0];
                      const totalProgress =
                        Array.isArray(project.milestones) &&
                        project.milestones.length > 0
                          ? project.milestones.reduce(
                              (sum, milestone) =>
                                sum + milestone.completionPercentage,
                              0
                            ) / project.milestones.length
                          : 0;

                      return (
                        lat &&
                        lon && (
                          <Marker key={project.id} position={[lat, lon]}>
                            <Popup>
                              {project.name} <br /> Status: {project.status}{" "}
                              <br /> Progress:{" "}
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${totalProgress}%` }}
                                ></div>
                              </div>
                              {totalProgress.toFixed(1)}%
                            </Popup>
                          </Marker>
                        )
                      );
                    })}
                    {layers.solarIrradiance && (
                      <GeoJSON
                        key="solarIrradiance"
                        data={solarIrradianceData as FeatureCollection}
                        pointToLayer={(feature, latlng) =>
                          L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "yellow",
                            color: "red",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8,
                          })
                        }
                        onEachFeature={(feature, layer) => {
                          layer.bindPopup(
                            `Solar Irradiance: ${feature.properties.value} kWh/m²/day`
                          );
                        }}
                      />
                    )}
                    {layers.windSpeed && (
                      <GeoJSON
                        key="windSpeed"
                        data={windSpeedData as FeatureCollection}
                        pointToLayer={(feature, latlng) =>
                          L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "cyan",
                            color: "blue",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8,
                          })
                        }
                        onEachFeature={(feature, layer) => {
                          layer.bindPopup(
                            `Wind Speed: ${feature.properties.value} m/s`
                          );
                        }}
                      />
                    )}
                    {layers.protectedAreas && (
                      <GeoJSON
                        key="protectedAreas"
                        data={protectedAreasData as FeatureCollection}
                        style={{
                          color: "red",
                          weight: 2,
                          fillOpacity: 0.4,
                        }}
                        onEachFeature={(feature, layer) => {
                          layer.bindPopup(
                            `Protected Area: ${feature.properties.name}`
                          );
                        }}
                      />
                    )}
                    {layers.weatherTemp && (
                      <TileLayer
                        url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                        attribution='© <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                      />
                    )}
                    {layers.weatherPrecip && (
                      <TileLayer
                        url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                        attribution='© <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                      />
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Project List</h2>
              <DataTable
                data={
                  filteredProjects.length > 0
                    ? filteredProjects
                    : projects.map((project) => ({
                        ...project,
                        progress:
                          Array.isArray(project.milestones) &&
                          project.milestones.length > 0
                            ? project.milestones.reduce(
                                (sum, milestone) =>
                                  sum + milestone.completionPercentage,
                                0
                              ) / project.milestones.length
                            : 0,
                      }))
                }
                onProjectUpdated={refreshProjects}
              />
            </div>

            {/* AI Insights */}
            <AIInsights projects={projects} />

            {/* Chatbot Section */}
            <Bubble
              projects={projects}
              onFilterProjects={setFilteredProjects}
            />
          </div>
        </section>
      </div>
    </ClientWrapper>
  );
}
