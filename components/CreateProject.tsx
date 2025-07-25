"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { createProjectAction } from "@/server/actions/projectActions";
import { toast } from "react-hot-toast";

// Define the callback type
type OnProjectCreated = () => void;

interface CreateProjectProps {
  userId: string;
  onProjectCreated: OnProjectCreated;
}

export default function CreateProject({
  userId,
  onProjectCreated,
}: CreateProjectProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "", // Expecting "lat,lon" format
    status: "Planning" as const,
  });

  const { execute, status } = useAction(createProjectAction, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success);
        setFormData({ name: "", location: "", status: "Planning" });
        setOpen(false);
        onProjectCreated(); // Callback to refresh projects
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute({ ...formData, userId });
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const modal = document.querySelector(
        ".bg-gray-900/50.border.border-gray-800.rounded-lg.p-6"
      );
      if (modal && !modal.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="bg-cyan-600 hover:bg-cyan-700"
      >
        Add New Project
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-gray-800"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location (lat,lon)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., 12.9716,77.5946"
                  className="text-gray-800"
                  required
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as typeof formData.status,
                    })
                  }
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={status === "executing"}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {status === "executing" ? "Creating..." : "Create"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="text-gray-800 border-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
