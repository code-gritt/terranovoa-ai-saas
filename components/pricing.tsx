import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const plans = [
    {
      name: "Explorer",
      price: "$49",
      description: "Ideal for individual renewable energy enthusiasts",
      features: [
        "5 Projects",
        "10GB Storage",
        "Basic Geospatial Maps",
        "Email Support",
      ],
    },
    {
      name: "Innovator",
      price: "$99",
      description: "Perfect for growing energy teams",
      features: [
        "15 Projects",
        "50GB Storage",
        "AI-Powered Insights",
        "Priority Support",
        "Mapbox Integration",
        "Custom Reports",
      ],
      popular: true,
    },
    {
      name: "Visionary",
      price: "$199",
      description: "Tailored for large-scale energy organizations",
      features: [
        "Unlimited Projects",
        "500GB Storage",
        "Advanced AI Analytics",
        "24/7 Dedicated Support",
        "Enterprise Security",
        "Custom Development",
        "Onboarding Assistance",
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-20 md:py-32">
      {/* Background SVG pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern
            id="pattern-circles"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
          >
            <circle
              id="pattern-circle"
              cx="10"
              cy="10"
              r="1.6257413380501518"
              fill="#fff"
            ></circle>
          </pattern>
          <rect
            id="rect"
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern-circles)"
          ></rect>
        </svg>
      </div>

      <div className="container relative px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mb-16 text-lg text-gray-400">
            Choose the plan that powers your renewable energy vision
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-xl border bg-gray-900/50 p-8 backdrop-blur-sm ${
                plan.popular
                  ? "border-2 border-purple-600 relative"
                  : "border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <div className="mb-2 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>
              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-auto ${
                  plan.popular
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
