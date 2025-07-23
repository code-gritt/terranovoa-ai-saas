import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gray-950"></div>

      <div className="container relative px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-8 md:p-10 relative overflow-hidden shadow-lg">
            {/* Simplified decorative elements - just one gradient */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>

            {/* Gradient border on left instead of top for visual interest */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to empower your energy future?
                </h2>
                <p className="text-gray-300">
                  Join hundreds of energy innovators using TerraNovoa AI.
                </p>
              </div>
              <div>
                <Button className="h-12 px-6 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Simplified features row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300 text-sm">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300 text-sm">7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300 text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
