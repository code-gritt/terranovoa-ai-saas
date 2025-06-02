"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Faq() {
  const faqs = [
    {
      question: "How does the free trial work?",
      answer:
        "Our free trial gives you full access to all features for 14 days. No credit card required. At the end of the trial, you can choose the plan that best suits your needs or continue with the free plan with limited features.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new rate will be charged immediately. If you downgrade, the new rate will be applied at the next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards including Visa, Mastercard, and American Express. We also support payment via PayPal and bank transfers for annual enterprise plans.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regularly undergo security audits to ensure your data is protected.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. Once canceled, you'll still have access to your plan until the end of your current billing period.",
    },
    {
      question: "Do you offer discounts for non-profits or educational institutions?",
      answer:
        "Yes, we offer special pricing for non-profit organizations, educational institutions, and startups. Please contact our sales team for more information.",
    },
  ]

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-900/10 rounded-full blur-3xl"></div>

      <div className="container relative px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-purple-400 font-medium mb-2">Questions & Answers</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">
            Find answers to common questions about SaasPro. If you can't find what you're looking for, feel free to
            contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-purple-400 transition-transform duration-300",
                      activeIndex === index ? "transform rotate-180" : "",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-gray-400">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Still have questions?{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
