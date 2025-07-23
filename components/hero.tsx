import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

      {/* Background SVG pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative px-4 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 mx-auto max-w-4xl inline-block rounded-full bg-gray-800 px-4 py-1 text-sm">
            <span className="text-cyan-400">New</span> — TerraNovoa AI is now
            live
          </div>
          <h1 className="mb-6 mx-auto max-w-4xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
            Revolutionize Renewable Energy with TerraNovoa AI
          </h1>
          <p className="mb-10 mx-auto max-w-3xl text-xl text-gray-400 md:text-2xl">
            Explore AI-powered geospatial mapping and insights for a sustainable
            future.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="bg-cyan-600 text-white hover:bg-cyan-700 h-12 px-8 text-base">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open("https://koalendar.com/e/meet-with-gokul", "_blank")
              }
              className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white h-12 px-8 text-base"
            >
              Book a Demo
            </Button>
          </div>

          <div className="mt-16 relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 opacity-70 blur"></div>
            <div className="relative rounded-xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
              <Image
                src="/images/hero.webp"
                alt="TerraNovoa AI Dashboard Preview"
                width={1200}
                height={675}
                className="w-full h-auto opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
