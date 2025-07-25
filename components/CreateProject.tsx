"use client";

import { useAction } from "next-safe-action/hooks";
import { createProjectAction } from "@/server/actions/projectActions";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

type ProjectStatus = "Planning" | "Active" | "Completed" | "On Hold";

interface CreateProjectProps {
  userId: string;
  onProjectCreated: () => void;
  coordinates?: string; // Optional coordinates (e.g., "lat,lon")
}

export default function CreateProject({
  userId,
  onProjectCreated,
  coordinates,
}: CreateProjectProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(coordinates || "");
  const [status, setStatus] = useState<ProjectStatus>("Planning");

  const { execute: createExecute } = useAction(createProjectAction, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success);
        setName("");
        setLocation("");
        setStatus("Planning");
        onProjectCreated();
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;
    createExecute({ name, location, status, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>
      <div>
        <Label htmlFor="project-location">Location (lat,lon)</Label>
        <Input
          id="project-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., 12.9716,77.5946"
          required
        />
      </div>
      <div>
        <Label htmlFor="project-status">Status</Label>
        <Select value={status} onValueChange={setStatus as any}>
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
        Create Project
      </Button>
    </form>
  );
}
