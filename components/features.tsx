import { MapPin, Brain, Users, Bolt, Shield, Globe } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Interactive Geospatial Maps",
      description:
        "Visualize renewable energy projects with cutting-edge, AI-enhanced maps.",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      title: "AI-Powered Insights",
      description:
        "Unlock data-driven decisions with advanced geospatial analytics.",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      title: "Collaborative Project Management",
      description:
        "Team up globally to streamline renewable energy initiatives.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Automated Workflows",
      description:
        "Optimize time with AI-driven automation for reporting and analysis.",
      icon: <Bolt className="h-6 w-6" />,
    },
    {
      title: "Enterprise-Grade Security",
      description:
        "Protect your geospatial data with top-tier encryption and safety.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Global Support Network",
      description: "Access round-the-clock assistance from our worldwide team.",
      icon: <Globe className="h-6 w-6" />,
    },
  ];

  return (
    <section id="features" className="relative py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

      <div className="container relative px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Innovative Features
          </h2>
          <p className="mb-16 text-lg text-gray-400">
            Empower your renewable energy future with TerraNovoa AI
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-900/50 hover:bg-gray-800/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600/20 text-cyan-400">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
