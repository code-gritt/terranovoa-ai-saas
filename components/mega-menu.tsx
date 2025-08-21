"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
};

type MenuColumn = {
  title: string;
  items: MenuItem[];
};

type FeaturedItem = {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
} | null;

type MegaMenuProps = {
  data: {
    title: string;
    columns: MenuColumn[];
    featured?: FeaturedItem;
  };
};

export default function MegaMenu({ data }: MegaMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animate on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "max-w-5xl w-full px-4 py-6 transition-all duration-300 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <div
        className={cn(
          "grid gap-8",
          data.featured
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        )}
      >
        {/* Menu columns */}
        <div
          className={cn(
            "grid gap-8",
            data.featured
              ? "col-span-2 grid-cols-1 md:grid-cols-2"
              : "col-span-2 grid-cols-1 sm:grid-cols-2"
          )}
        >
          {data.columns.map((column, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                {column.title}
              </h3>
              <ul className="space-y-4">
                {column.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-800 text-purple-400 group-hover:bg-purple-900/20">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-purple-400">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured section (optional) */}
        {data.featured && (
          <div className="col-span-1">
            <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
              <div className="relative h-40">
                <Image
                  src={data.featured.imageSrc || "/placeholder.svg"}
                  alt={data.featured.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-medium text-white">
                  {data.featured.title}
                </h3>
                <p className="mb-4 text-sm text-gray-400">
                  {data.featured.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Link href={data.featured.ctaLink}>
                    {data.featured.ctaText}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
