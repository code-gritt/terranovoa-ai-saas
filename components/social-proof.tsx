"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function SocialProof() {
  const companies = [
    { name: "Slack", logo: "https://cdn.simpleicons.org/slack" },
    { name: "Shopify", logo: "https://cdn.simpleicons.org/shopify" },
    { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe" },
    { name: "Notion", logo: "https://cdn.simpleicons.org/notion" },
    { name: "Figma", logo: "https://cdn.simpleicons.org/figma" },
    { name: "Trello", logo: "https://cdn.simpleicons.org/trello" },
  ]

  const stats = [
    { value: "10k+", label: "Active Users" },
    { value: "500+", label: "Enterprise Clients" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container relative px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-purple-400 font-medium mb-2">Trusted by professionals from top brands </p>
          <h2 className="text-2xl md:text-3xl font-bold">Join thousands of satisfied customers</h2>
        </div>

        {/* Company logos */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              className="transition-all duration-300"
              variants={itemVariants}
            >
              <div className="bg-gray-800 rounded-lg p-4 w-[80px] h-[40px] flex items-center justify-center">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={50}
                  height={40}
                  className="w-auto h-auto brightness-0 invert"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur-sm"></div>
                <div className="relative bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
