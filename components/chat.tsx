"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";
import { geocodeLocation } from "@/lib/utils";
import { CohereClient } from "cohere-ai";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist"; // ✅ smaller build

// ✅ Wrap Plotly with factory
const Plot = dynamic(
  async () => {
    const PlotlyFactory = (await import("react-plotly.js/factory")).default;
    return PlotlyFactory(Plotly);
  },
  { ssr: false, loading: () => <div>Loading plot...</div> }
);

const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY || "", // ✅ never hardcode secret
});

interface Message {
  text: string;
  sender: "user" | "bot";
  isTyping?: boolean;
}

interface ChatProps {
  onLocationUpdate?: (lat: number, lng: number) => void;
  onFormSubmit?: () => void;
}

export default function Chat({ onLocationUpdate, onFormSubmit }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function getEnergyAdvice(prompt: string): Promise<string> {
    try {
      const chatResponse = await cohere.chat({
        model: "command-r-plus-08-2024",
        message: prompt,
        chatHistory: [
          {
            role: "SYSTEM",
            message:
              "You are an Energy Advisor who provides scientifically accurate analyses on renewable energy potential based on historical data.",
          },
        ],
      });

      return chatResponse.text || "No response from model.";
    } catch (err) {
      console.error("Cohere API error:", err);
      return "⚠️ Error contacting AI service.";
    }
  }

  async function handleSend() {
    if (!input.trim()) return;

    // show user message
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    // show typing indicator
    setMessages((prev) => [
      ...prev,
      {
        text: "Analyzing renewable energy potential...",
        sender: "bot",
        isTyping: true,
      },
    ]);

    try {
      let locationData;
      try {
        locationData = await geocodeLocation(input);
      } catch {
        locationData = { success: false };
      }

      let prompt = input;
      if (locationData.success) {
        prompt = `Analyze the renewable energy potential for coordinates: ${locationData.lat}, ${locationData.lng} (${locationData.formattedAddress}).`;

        // notify parent with location
        onLocationUpdate?.(locationData.lat, locationData.lng);
      }

      const advice = await getEnergyAdvice(prompt);

      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [...withoutTyping, { text: advice, sender: "bot" }];
      });

      // notify parent
      onFormSubmit?.();
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [
          ...withoutTyping,
          { text: "⚠️ Error fetching advice. Try again.", sender: "bot" },
        ];
      });
    } finally {
      setInput("");
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 scroll-smooth">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <Bot className="w-6 h-6 text-gray-500 mt-1 shrink-0" />
            )}
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              {msg.isTyping && (
                <span className="animate-pulse text-sm text-gray-500">
                  Typing...
                </span>
              )}
            </div>
            {msg.sender === "user" && (
              <User className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about renewable energy potential..."
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
