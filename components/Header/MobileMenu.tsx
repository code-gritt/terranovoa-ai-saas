import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Users,
  BarChart3,
  FileText,
  BookOpen,
  MessageSquare,
  LayoutGrid,
  CreditCard,
  Star,
  LogIn,
  ChevronRight,
} from "lucide-react";

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}) {
  if (!isMenuOpen) return null;

  return (
    <>
      <div
        className="md:hidden fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsMenuOpen(false)}
      />

      <div className="md:hidden fixed top-16 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto">
        <div
          className="mx-3 mt-2 rounded-xl border border-purple-900/30"
          style={{
            background: "linear-gradient(180deg, #1a1a2e 0%, #16161e 100%)",
          }}
        >
          <nav className="flex flex-col p-3">
            {/* Products */}
            {/* ... same as before ... */}

            {/* Resources */}
            {/* ... same as before ... */}

            {/* NEW: Modules */}
            <div className="mb-3 pb-3 border-b border-gray-800/50">
              <div className="flex items-center mb-2 px-1">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-white text-base">Modules</h3>
              </div>
              <div className="space-y-0.5">
                <Link
                  href="/wms"
                  className="flex items-center py-2 px-3 text-gray-200 rounded-lg hover:bg-gray-800 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="font-medium text-sm">
                    Waste Management System
                  </span>
                  <ChevronRight className="ml-auto h-3 w-3 text-gray-500" />
                </Link>
                <Link
                  href="/fds"
                  className="flex items-center py-2 px-3 text-gray-200 rounded-lg hover:bg-gray-800 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="font-medium text-sm">
                    Flood Detection System
                  </span>
                  <ChevronRight className="ml-auto h-3 w-3 text-gray-500" />
                </Link>
              </div>
            </div>

            {/* Other navigation (features, pricing, etc.) */}
            {/* ... same as before ... */}
          </nav>
        </div>
      </div>
    </>
  );
}
