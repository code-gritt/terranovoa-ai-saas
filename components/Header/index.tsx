"use client"

import { useState, useRef, useEffect } from "react"
import DesktopNav from "./DesktopNav"
import MobileMenu from "./MobileMenu"
import Logo from "./Logo"
import HeaderActions from "./HeaderActions"
// Add missing icon imports
import { Menu, X, ChevronDown, Laptop, Users, BarChart3, Settings, HelpCircle, FileText, Zap } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, opacity: 0 })
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const megaMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (menuId: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
    }
    setActiveMegaMenu(menuId)

    const navElement = navRefs.current[menuId]
    if (navElement) {
      const rect = navElement.getBoundingClientRect()
      const parentRect = navElement.parentElement?.getBoundingClientRect() || { left: 0 }

      setIndicatorStyle({
        width: rect.width,
        left: rect.left - parentRect.left,
        opacity: 1,
      })
    }
  }

  const handleMouseLeave = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
    }

    if (!isHoveringMenu) {
      menuTimeoutRef.current = setTimeout(() => {
        setActiveMegaMenu(null)
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
      }, 300)
    }
  }

  const handleMenuMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
    }
    setIsHoveringMenu(true)
  }

  const handleMenuMouseLeave = () => {
    setIsHoveringMenu(false)
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null)
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
    }, 300)
  }

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
              href: "#",
            },
            {
              icon: <Users className="h-5 w-5" />,
              title: "Team Management",
              description: "Organize and manage your team",
              href: "#",
            },
            {
              icon: <BarChart3 className="h-5 w-5" />,
              title: "Analytics",
              description: "Insights and data visualization",
              href: "#",
            },
          ],
        },
        {
          title: "Add-ons",
          items: [
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Automation",
              description: "Streamline your workflows",
              href: "#",
            },
            {
              icon: <Settings className="h-5 w-5" />,
              title: "Integrations",
              description: "Connect with other tools",
              href: "#",
            },
            {
              icon: <FileText className="h-5 w-5" />,
              title: "Reports",
              description: "Generate detailed reports",
              href: "#",
            },
          ],
        },
      ],
      featured: {
        title: "New Feature",
        description: "Try our new AI-powered analytics dashboard",
        ctaText: "Learn More",
        ctaLink: "#",
        imageSrc: "/images/dashboard.png",
      },
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
            {
              icon: <Users className="h-5 w-5" />,
              title: "Community Forum",
              description: "Connect with other users",
              href: "#",
            },
          ],
        },
        {
          title: "Learning",
          items: [
            { icon: <Laptop className="h-5 w-5" />, title: "Tutorials", description: "Step-by-step guides", href: "#" },
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Webinars",
              description: "Live and recorded sessions",
              href: "#",
            },
            { icon: <FileText className="h-5 w-5" />, title: "Blog", description: "Latest news and tips", href: "#" },
          ],
        },
      ],
      featured: {
        title: "Latest Webinar",
        description: "Maximizing Productivity with SaasPro",
        ctaText: "Watch Now",
        ctaLink: "#",
        imageSrc: "/images/webinar.png",
      },
    },
  }

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
  )
}
