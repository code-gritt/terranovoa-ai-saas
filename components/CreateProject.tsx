// src/components/CreateProject.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Milestone = {
  name: string;
  targetDate: string;
  completionPercentage: number;
};

type CreateProjectProps = {
  userId: string;
  onProjectCreated: () => void;
  coordinates?: string;
  onMilestonesChange?: (milestones: Milestone[]) => void;
};

export default function CreateProject({
  userId,
  onProjectCreated,
  coordinates,
  onMilestonesChange,
}: CreateProjectProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(coordinates || "");
  const [status, setStatus] = useState<
    "Planning" | "Active" | "Completed" | "On Hold"
  >("Planning");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "", targetDate: "", completionPercentage: 0 },
  ]);

  const handleAddMilestone: React.MouseEventHandler<HTMLButtonElement> = () => {
    setMilestones([
      ...milestones,
      { name: "", targetDate: "", completionPercentage: 0 },
    ]);
  };

  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string | number
  ) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
    if (onMilestonesChange) onMilestonesChange(newMilestones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location,
        status,
        userId,
        milestones,
      }),
    });
    if (response.ok) onProjectCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        required
      />
      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (lat,lon)"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="w-full p-2 bg-white border border-gray-700 rounded"
      >
        <option value="Planning">Planning</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
      </select>
      <div>
        <h3 className="text-sm font-bold">Milestones</h3>
        {milestones.map((milestone, index) => (
          <div key={index} className="space-y-2 mt-2">
            <Input
              value={milestone.name}
              onChange={(e) =>
                handleMilestoneChange(index, "name", e.target.value)
              }
              placeholder="Milestone Name"
              required
            />
            <Input
              type="date"
              value={milestone.targetDate}
              onChange={(e) =>
                handleMilestoneChange(index, "targetDate", e.target.value)
              }
              required
            />
            <Input
              type="number"
              value={milestone.completionPercentage}
              onChange={(e) =>
                handleMilestoneChange(
                  index,
                  "completionPercentage",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="Completion % (0-100)"
              min="0"
              max="100"
              required
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddMilestone}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700"
        >
          Add Milestone
        </Button>
      </div>
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Create Project
      </Button>
    </form>
  );
}
