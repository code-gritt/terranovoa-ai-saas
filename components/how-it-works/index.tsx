"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function HowItWorks() {
  // Refs for scroll triggering
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description:
        "Create your TerraNovoa AI account instantly. Enjoy a 7-day free trial with no credit card needed.",
      color: "from-cyan-500 to-cyan-700",
      image: "/images/dashboard.png",
      icon: "/icons/signup.svg",
    },
    {
      number: "02",
      title: "Configure Your Map",
      description:
        "Customize your geospatial workspace and invite your team for collaborative energy projects.",
      color: "from-purple-500 to-cyan-500",
      image: "/images/team.png",
      icon: "/icons/configure.svg",
    },
    {
      number: "03",
      title: "Import Energy Data",
      description:
        "Upload renewable energy project data or use our AI-optimized templates to get started.",
      color: "from-green-500 to-purple-500",
      image: "/images/webinar.png",
      icon: "/icons/import.svg",
    },
    {
      number: "04",
      title: "Launch Insights",
      description:
        "Start leveraging AI-driven insights and holo-screenshots to transform your energy workflow.",
      color: "from-cyan-500 to-purple-500",
      image: "/images/automation.png",
      icon: "/icons/launch.svg",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
      ref={sectionRef}
    >
      {/* Background elements - floating gradient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-cyan-600/20 to-purple-600/20 blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0H0V1.5V30H1.5V1.5H30V0H1.5Z' fill='white'/%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="container relative px-4 md:px-8 z-10">
        {/* Header with animated underline */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/50 rounded-full backdrop-blur-sm mb-4">
              Seamless Start
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              How TerraNovoa AI{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Empowers
              </span>{" "}
              Your Energy Future
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              A seamless four-step process to revolutionize your renewable
              energy projects
            </p>

            {/* Animated underline */}
            <div className="relative w-40 h-1 mx-auto mt-6">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Interactive Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-600/70 via-purple-600/70 to-cyan-600/70 rounded-full transform -translate-x-1/2" />

          {/* Steps container */}
          <div className="space-y-20 md:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { duration: 0.8, delay: index * 0.2 },
                  },
                }}
                initial="hidden"
                animate={mainControls}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-6 md:gap-12`}
              >
                {/* Step number without hover animation */}
                <div className="relative shrink-0 z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-full border-2 border-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-900/20">
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  {/* Pulsing circle animation */}
                  <div className="absolute -inset-3 z-0">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-50" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-sm" />
                  </div>
                </div>

                {/* Content card without hover animation */}
                <div className="flex-1">
                  <div className="relative bg-gray-900/90 backdrop-blur-md rounded-xl overflow-hidden md:max-w-[90%]">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/20 via-transparent to-purple-800/20 opacity-50" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 to-purple-600" />

                    <div className="p-6 md:p-8 relative">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3">
                            {step.title}
                          </h3>
                          <p className="text-gray-300">{step.description}</p>

                          <ul className="mt-5 space-y-2">
                            {[1, 2, 3].map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-300">
                                  {item === 1
                                    ? "Secure account setup"
                                    : item === 2
                                    ? "Custom map layers"
                                    : "AI data validation"}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6">
                            <a
                              href="#"
                              className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Learn more about this step{" "}
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                          </div>
                        </div>

                        {/* Image without hover animation */}
                        <div className="relative shrink-0 md:w-1/2 aspect-[4/3] rounded-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-purple-600/10 z-10" />
                          <Image
                            src={step.image || "/placeholder.svg"}
                            alt={step.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA without hover animation */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur-md opacity-70" />
            <a
              href="#"
              className="relative inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-600/90 to-purple-600/90 text-white font-medium text-lg hover:from-cyan-500 hover:to-purple-500 transition-all shadow-lg shadow-cyan-900/30"
            >
              Empower Your Energy Future <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <p className="mt-4 text-gray-400">
            Join hundreds of energy innovators with TerraNovoa AI
          </p>
        </motion.div>
      </div>
    </section>
  );
}
