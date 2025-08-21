"use client";

import { useState, useRef, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import HeaderActions from "./HeaderActions";
import {
  Laptop,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
    opacity: 0,
  });
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    };
  }, []);

  const megaMenus = {
    products: {
      title: "Products",
      columns: [
        {
          title: "Core Platform",
          items: [
            {
              icon: <Laptop className="h-5 w-5" />,
              title: "Dashboard",
              description: "Complete overview of your business",
              href: "/dashboard",
            },
            {
              icon: <Users className="h-5 w-5" />,
              title: "Team Management",
              description: "Organize and manage your team",
              href: "/dashboard",
            },
            {
              icon: <BarChart3 className="h-5 w-5" />,
              title: "Analytics",
              description: "Insights and data visualization",
              href: "/dashboard",
            },
          ],
        },
      ],
    },
    resources: {
      title: "Resources",
      columns: [
        {
          title: "Help & Support",
          items: [
            {
              icon: <FileText className="h-5 w-5" />,
              title: "Documentation",
              description: "Guides and references",
              href: "#",
            },
            {
              icon: <HelpCircle className="h-5 w-5" />,
              title: "Knowledge Base",
              description: "Answers to common questions",
              href: "#",
            },
          ],
        },
      ],
    },
    modules: {
      title: "Modules",
      columns: [
        {
          title: "Systems",
          items: [
            {
              icon: <BarChart3 className="h-5 w-5" />,
              title: "Waste Management System",
              description: "Manage and monitor waste efficiently",
              href: "/wms",
            },
            {
              icon: <BarChart3 className="h-5 w-5" />,
              title: "Flood Detection System",
              description: "Real-time flood monitoring & alerts",
              href: "/fds",
            },
          ],
        },
      ],
    },
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <DesktopNav
            activeMegaMenu={activeMegaMenu}
            setActiveMegaMenu={setActiveMegaMenu}
            indicatorStyle={indicatorStyle}
            setIndicatorStyle={setIndicatorStyle}
            navRefs={navRefs}
            menuTimeoutRef={menuTimeoutRef}
            isHoveringMenu={isHoveringMenu}
            setIsHoveringMenu={setIsHoveringMenu}
            megaMenuRef={megaMenuRef as React.RefObject<HTMLDivElement>}
            megaMenus={megaMenus}
          />
        </div>
        <HeaderActions isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </header>
  );
}
