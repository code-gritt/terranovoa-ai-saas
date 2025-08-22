"use client";

import { useRef, useState, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";
import { geocodeLocation } from "@/lib/utils";
import { CohereClient } from "cohere-ai";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div>Loading plot...</div>,
});

const cohere = new CohereClient({
  token: "E5fJWZ2J9xQIxccl78UjDvk7pYFs5rBjnLhwwNQ2",
});

interface Message {
  text: string;
  sender: "user" | "bot";
  isTyping?: boolean;
}

// ✅ Add props interface
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

  // ✅ Extract coords from model response
  function extractCoordinatesFromResponse(text: string) {
    const degreesRegex =
      /(\d+\.?\d*)\s*°?\s*([NSns])[,\s]+(\d+\.?\d*)\s*°?\s*([EWew])/u;

    const match = text.match(degreesRegex);
    if (!match) return null;

    let lat = parseFloat(match[1]);
    let lng = parseFloat(match[3]);

    if (match[2].toUpperCase() === "S") lat = -lat;
    if (match[4].toUpperCase() === "W") lng = -lng;

    return { lat, lng };
  }

  async function getEnergyAdvice(prompt: string): Promise<string> {
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

    return chatResponse.text || "No response from model";
  }

  async function handleSend() {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

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

        // ✅ Trigger parent callback with location
        onLocationUpdate?.(locationData.lat, locationData.lng);
      }

      const advice = await getEnergyAdvice(prompt);

      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isTyping);
        return [...filtered, { text: advice, sender: "bot" }];
      });

      // ✅ Trigger parent form submit callback (auto expand chat)
      onFormSubmit?.();
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isTyping);
        return [
          ...filtered,
          {
            text: "⚠️ Error fetching energy advice. Please try again.",
            sender: "bot",
          },
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
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about renewable energy potential..."
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
