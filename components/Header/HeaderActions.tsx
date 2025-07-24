"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Menu, X } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/lib/store";
import { signOut } from "next-auth/react";

export default function HeaderActions({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}) {
  const path = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
  const { user, setUser, clearUser } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id || "",
        email: session.user.email || "",
        firstName: session.user.firstName || null,
        lastName: session.user.lastName || null,
      });
    } else if (status === "unauthenticated") {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = () => {
    if (!user) return "NA";
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="flex items-center gap-4">
      {user && (
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400 transition text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="md:hidden w-8 sm:w-10 h-8 sm:h-10 p-0 text-gray-700 dark:text-gray-200"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </Link>
      )}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-primary text-white dark:bg-gray-700"
            >
              {getInitials()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 sm:w-56 bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-lg"
            align="end"
          >
            <DropdownMenuLabel className="text-white font-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800 my-1" />
            <DropdownMenuItem className="flex flex-col items-start text-sm text-gray-400 hover:bg-gray-900 rounded-md p-2">
              <span className="font-medium text-white">Email</span>
              <span>{user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start text-sm text-gray-400 hover:bg-gray-900 rounded-md p-2">
              <span className="font-medium text-white">First Name</span>
              <span>{user.firstName || "N/A"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start text-sm text-gray-400 hover:bg-gray-900 rounded-md p-2">
              <span className="font-medium text-white">Last Name</span>
              <span>{user.lastName || "N/A"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800 my-1" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 text-sm hover:bg-gray-900 rounded-md p-2"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden md:block text-sm font-medium text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-900 transition"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:text-white hover:from-purple-700 hover:to-pink-600 shadow-md"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-gray-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
}
