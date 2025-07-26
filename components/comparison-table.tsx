import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparisonTable() {
  const features = [
    { name: "Core Geospatial Tools", basic: true, pro: true, enterprise: true },
    { name: "Unlimited Projects", basic: false, pro: true, enterprise: true },
    { name: "API Access", basic: false, pro: true, enterprise: true },
    { name: "AI-Powered Analytics", basic: false, pro: true, enterprise: true },
    {
      name: "Custom Map Integrations",
      basic: false,
      pro: false,
      enterprise: true,
    },
    { name: "Dedicated Support", basic: false, pro: false, enterprise: true },
    { name: "SLA Guarantee", basic: false, pro: false, enterprise: true },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>

      <div className="container relative px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-purple-400 font-medium mb-2">Plan Comparison</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Find the Perfect Plan
          </h2>
          <p className="text-gray-400 text-lg">
            Compare our plans to find the one that best suits your renewable
            energy needs. All plans include our core features.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center">
                  <div className="font-bold text-xl mb-2">Explorer</div>
                  <div className="text-3xl font-bold mb-2">
                    $0<span className="text-lg text-gray-400">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    For individual enthusiasts
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-gray-800 border-gray-700 hover:bg-gray-800"
                  >
                    Get Started
                  </Button>
                </div>
                <div className="col-span-1 text-center relative">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                    MOST POPULAR
                  </div>
                  <div className="font-bold text-xl mb-2">Innovator</div>
                  <div className="text-3xl font-bold mb-2">
                    $29<span className="text-lg text-gray-400">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    For growing energy teams
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Get Started
                  </Button>
                </div>
                <div className="col-span-1 text-center">
                  <div className="font-bold text-xl mb-2">Visionary</div>
                  <div className="text-3xl font-bold mb-2">
                    $59<span className="text-lg text-gray-400">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    For large energy organizations
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-800 hover:bg-gray-800"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>

              {/* Table body */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 py-4 border-t border-gray-800"
                  >
                    <div className="col-span-1 flex items-center font-medium">
                      {feature.name}
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                      {feature.basic ? (
                        <Check className="h-5 w-5 text-purple-400" />
                      ) : (
                        <X className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                      {feature.pro ? (
                        <Check className="h-5 w-5 text-purple-400" />
                      ) : (
                        <X className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                      {feature.enterprise ? (
                        <Check className="h-5 w-5 text-purple-400" />
                      ) : (
                        <X className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
