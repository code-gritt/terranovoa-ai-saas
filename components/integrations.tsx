"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Integrations() {
  const integrations = [
    {
      name: "Mapbox",
      category: "Mapping",
      logo: "https://cdn.simpleicons.org/mapbox",
    },
    {
      name: "GitHub",
      category: "Development",
      logo: "https://cdn.simpleicons.org/github",
    },
    {
      name: "ArcGIS",
      category: "GIS",
      logo: "https://cdn.simpleicons.org/esri",
    },
    {
      name: "Google Earth",
      category: "Geospatial",
      logo: "https://cdn.simpleicons.org/googleearth",
    },
    {
      name: "AutoCAD",
      category: "Design",
      logo: "https://cdn.simpleicons.org/autodesk",
    },
    {
      name: "Siemens MindSphere",
      category: "IoT",
      logo: "https://cdn.simpleicons.org/siemens",
    },
    {
      name: "Zapier",
      category: "Automation",
      logo: "https://cdn.simpleicons.org/zapier",
    },
    {
      name: "PayPal",
      category: "Payments",
      logo: "https://cdn.simpleicons.org/paypal",
    },
    {
      name: "Salesforce",
      category: "CRM",
      logo: "https://cdn.simpleicons.org/salesforce",
    },
    {
      name: "Microsoft Teams",
      category: "Collaboration",
      logo: "https://cdn.simpleicons.org/microsoftteams",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-purple-400 font-medium mb-2">
            Seamless Connections
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Integrate with Your Energy Tools
          </h2>
          <p className="text-gray-400 text-lg">
            TerraNovoa AI connects with the tools you use for renewable energy
            and geospatial workflows.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {integrations.map((integration, index) => (
            <motion.div key={index} className="group" variants={itemVariants}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-800">
                <div className="relative mb-4 w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                  <div className="bg-gray-800 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                    <Image
                      src={integration.logo || "/placeholder.svg"}
                      alt={integration.name}
                      width={40}
                      height={40}
                      className="relative z-10 w-8 h-8 object-contain brightness-0 invert"
                    />
                  </div>
                </div>
                <h3 className="font-medium mb-1">{integration.name}</h3>
                <p className="text-xs text-gray-500">{integration.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            ...and many more integrations available
          </p>
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center"
          >
            View all integrations
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
