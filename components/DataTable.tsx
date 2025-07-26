"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import {
  deleteProjectAction,
  updateProjectAction,
} from "@/server/actions/projectActions";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Define the status type as a union
type ProjectStatus = "Planning" | "Active" | "Completed" | "On Hold";

type Milestone = {
  name: string;
  targetDate: string;
  completionPercentage: number;
};

type Project = {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  userId: string;
  milestones?: Milestone[]; // Add milestones as optional
  progress?: number; // Add progress as optional for compatibility
};

interface DataTableProps {
  data: Project[];
  onProjectUpdated: () => void; // Callback to refresh data
}

export default function DataTable({ data, onProjectUpdated }: DataTableProps) {
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    location: string;
    status: ProjectStatus;
    milestones?: Milestone[];
  }>({
    name: "",
    location: "",
    status: "Planning",
  });
  const [deleteProject, setDeleteProject] = useState<Project | null>(null); // State for delete confirmation

  // Update action
  const { execute: updateExecute, status: updateStatus } = useAction(
    updateProjectAction,
    {
      onSuccess(data) {
        console.log("Update response:", data); // Debug log
        if (data.data?.success) {
          toast.success(data.data.success);
          setEditProject(null);
          onProjectUpdated();
        } else if (data.data?.error) {
          toast.error(data.data.error);
        }
      },
      onError(error) {
        console.error("Update error:", error); // Debug error
        toast.error("An error occurred while updating");
      },
    }
  );

  // Delete action
  const { execute: deleteExecute } = useAction(deleteProjectAction, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success);
        onProjectUpdated();
        setDeleteProject(null); // Close dialog on success
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) {
      console.log("Updating project:", editFormData); // Debug log
      updateExecute({
        projectId: editProject.id,
        name: editFormData.name,
        location: editFormData.location,
        status: editFormData.status,
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setEditFormData({
      name: project.name,
      location: project.location,
      status: project.status,
      milestones: project.milestones || [],
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteProject) {
      deleteExecute({ projectId: deleteProject.id });
    }
  };

  const handleChange = (
    field: keyof typeof editFormData,
    value: string | ProjectStatus | Milestone[]
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.original.progress || 0;
        return (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <span className="text-sm text-gray-400 ml-2">
              {progress.toFixed(1)}%
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-black border-gray-700"
              onClick={() => handleEdit(project)}
            >
              Edit
            </Button>
            <Dialog
              open={!!deleteProject && deleteProject.id === project.id}
              onOpenChange={(open) => setDeleteProject(open ? project : null)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteProject(project)}
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-400">
                    Are you sure you want to delete "{deleteProject?.name}"?
                    This action cannot be undone.
                  </p>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={deleteProject === null}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteProject(null)}
                    className="text-gray-800 border-gray-700"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-800 bg-gray-900/50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-800/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-300">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-400">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-gray-500 text-center"
                >
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editProject} onOpenChange={() => setEditProject(null)}>
        <DialogContent className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label className="text-white" htmlFor="edit-name">
                Project Name
              </Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-gray-800"
                required
              />
            </div>
            <div>
              <Label className="text-white" htmlFor="edit-location">
                Location (lat,lon)
              </Label>
              <Input
                id="edit-location"
                value={editFormData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., 12.9716,77.5946"
                className="text-gray-800"
                required
              />
            </div>
            <div>
              <Label className="text-white">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value: ProjectStatus) =>
                  handleChange("status", value)
                }
              >
                <SelectTrigger className="w-full bg-white border border-gray-700 rounded">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-700">
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="submit"
                disabled={updateStatus === "executing"}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {updateStatus === "executing" ? "Updating..." : "Update"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditProject(null)}
                className="text-gray-800 border-gray-700"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
