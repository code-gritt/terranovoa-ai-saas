"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconMessage,
  IconPlayerStopFilled,
  IconPlus,
  IconX,
  IconMaximize,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

// Debounce utility
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const Bubble = ({
  projects,
  onFilterProjects,
}: {
  projects: any[];
  onFilterProjects: (filtered: any[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageHistoryRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);

  // Debounced handleSubmit
  const debouncedHandleSubmit = debounce((e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  }, 500);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, query: input }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
        if (data.filteredIds && Array.isArray(data.filteredIds)) {
          const filtered = projects.filter((p) =>
            data.filteredIds.includes(p.id)
          );
          onFilterProjects(filtered);
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error fetching response. Please try again later.",
        },
      ]);
      console.error("Chat API error:", error);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const stop = () => {
    setIsLoading(false); // Simple stop mechanism
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleUserScroll = () => {
      if (messageHistoryRef.current) {
        const isAtBottom =
          messageHistoryRef.current.scrollHeight -
            messageHistoryRef.current.scrollTop ===
          messageHistoryRef.current.clientHeight;
        setIsUserScrolledUp(!isAtBottom);
      }
    };

    messageHistoryRef.current?.addEventListener("scroll", handleUserScroll);
    return () =>
      messageHistoryRef.current?.removeEventListener(
        "scroll",
        handleUserScroll
      );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setTimeout(() => setShowScrollButton(!entry.isIntersecting), 100);
      },
      { threshold: 0.1 }
    );

    if (messagesEndRef.current) observer.observe(messagesEndRef.current);
    return () => {
      if (messagesEndRef.current) observer.unobserve(messagesEndRef.current);
    };
  }, [messages]);

  useEffect(() => {
    if (!isUserScrolledUp && messages.length) scrollToBottom();
  }, [messages, isUserScrolledUp]);

  useEffect(() => {
    if (autoScroll && messages.length > 0) scrollToBottom();
  }, [messages, autoScroll]);

  const scrollIntoView = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
    setIsUserScrolledUp(false);
    setAutoScroll(true);
  };

  const handleBlockClick = (content: string) => {
    setInput(content);
    setMessages((prev) => [...prev, { role: "user", content }]);
    debouncedHandleSubmit(new Event("submit") as any);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpen(false);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const blocks = [
    {
      icon: <IconMessage className="h-6 w-6 text-blue-500" />,
      title: "General",
      content: "Tell me about TerraNova AI",
    },
    {
      icon: <IconMessage className="h-6 w-6 text-green-500" />,
      title: "Project Help",
      content: "Show me completed projects this month",
    },
    {
      icon: <IconMessage className="h-6 w-6 text-purple-500" />,
      title: "Data Insight",
      content: "What’s the average wind speed at project locations?",
    },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-10 right-10 flex flex-col items-end z-30 bubble-container",
        isExpanded &&
          "bottom-0 right-0 w-screen h-screen bg-black/30 backdrop-blur-sm flex items-center justify-center"
      )}
    >
      <motion.div
        initial={false}
        animate={
          isExpanded
            ? {
                opacity: [0, 0, 1],
                scale: [1, 0.98, 1],
                y: [0, 10, 0],
                rotateX: [0, 5, 0],
              }
            : { opacity: 1, scale: 1, y: 0, rotateX: 0 }
        }
        transition={{ duration: 0.3, times: [0, 0.4, 1] }}
        className={cn(
          "fixed md:relative inset-0 z-20",
          isExpanded && "w-[80%] h-[80%] relative"
        )}
      >
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="fixed md:hidden top-2 right-2 z-40"
          >
            <IconX />
          </button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 20, rotateX: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mb-4 h-screen md:h-[46vh] min-h-[76vh] w-full md:w-[30rem] bg-gray-100 rounded-lg flex flex-col justify-between overflow-hidden",
                isExpanded && "w-full h-full md:h-full md:w-full min-h-0 mb-0"
              )}
            >
              {/* Header */}
              <div className="h-10 w-full bg-gradient-to-l from-black via-gray-700 to-black rounded-tr-lg rounded-tl-lg flex justify-between px-6 py-2">
                <button
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    const element = document.querySelector(".bubble-container");
                    if (element) element.classList.toggle("scale-110");
                  }}
                  className="hover:bg-gray-800 p-1 rounded-full transition-colors"
                >
                  <IconMaximize className="h-4 w-4 text-white" />
                </button>
                {messages.length > 0 && (
                  <motion.button
                    className="rounded-full bg-black text-white px-2 py-0.5 text-sm flex items-center justify-center gap-1"
                    onClick={() => setMessages([])}
                    whileHover="hover"
                    initial="initial"
                    animate="initial"
                    variants={{
                      initial: { width: "4rem" },
                      hover: { width: "4rem" },
                    }}
                  >
                    <motion.div
                      variants={{
                        initial: { opacity: 0, width: 0 },
                        hover: { opacity: 1, width: "3.5rem" },
                      }}
                    >
                      <IconPlus className="h-4 w-4 flex-shrink-0" />
                    </motion.div>
                    <motion.span>New</motion.span>
                  </motion.button>
                )}
              </div>

              {/* Suggestion Blocks */}
              {!messages.length && (
                <div className="px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto">
                  {blocks.map((block, index) => (
                    <motion.button
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.3, delay: 0.2 * index }}
                      key={block.title}
                      onClick={() => handleBlockClick(block.content)}
                      className="p-4 flex flex-col text-left justify-between rounded-2xl h-32 md:h-40 w-full bg-white"
                    >
                      {block.icon}
                      <div>
                        <div className="text-base font-bold text-black">
                          {block.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {block.content}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Message History */}
              <div
                ref={messageHistoryRef}
                className="p-2 flex flex-1 overflow-y-auto"
              >
                <div className="flex flex-1 flex-col">
                  {messages.map((message) => (
                    <div key={message.id || message.content}>
                      {message.role === "user" ? (
                        <UserMessage content={message.content} />
                      ) : (
                        <AIMessage content={message.content || "No response"} />
                      )}
                    </div>
                  ))}
                  <div className="pb-10" ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={debouncedHandleSubmit}
                className="max-h-[10vh] py-1 px-5 relative"
              >
                {showScrollButton && (
                  <button
                    onClick={scrollIntoView}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <IconArrowNarrowDown className="h-5 w-5" />
                  </button>
                )}
                <AnimatePresence>
                  {isLoading ? (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={stop}
                      className="absolute top-1/2 right-8 -translate-y-1/2 bg-red-500 h-8 w-8 rounded-full flex items-center justify-center"
                    >
                      <IconPlayerStopFilled className="h-5 w-5 text-white" />
                    </motion.button>
                  ) : (
                    <button
                      type="submit"
                      className="absolute top-1/2 right-8 -translate-y-1/2 bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center"
                    >
                      <IconArrowNarrowUp className="h-5 w-5 text-neutral-500" />
                    </button>
                  )}
                </AnimatePresence>
                <textarea
                  ref={inputRef}
                  disabled={isLoading}
                  className="px-4 text-gray-800 w-full pr-10 rounded-lg border border-[#f2f2f2] py-[1rem] bg-white text-sm focus:outline-none transition duration-100"
                  placeholder="Type a message..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      debouncedHandleSubmit(event);
                    }
                  }}
                  rows={1}
                  style={{ resize: "none" }}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FAB Icon */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-14 relative z-10 group bg-white flex hover:bg-primary cursor-pointer items-center justify-center rounded-full shadow-derek transition duration-200",
          open ? "z-10" : "z-30",
          isExpanded && "hidden"
        )}
      >
        <IconMessage className="h-6 w-6 text-neutral-600 group-hover:text-black" />
      </button>
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => (
  <div className="p-2 rounded-lg flex gap-2 items-start justify-end">
    <div className="text-sm px-4 py-2 rounded-lg shadow-derek w-fit bg-gradient-to-br from-pink-500 to-violet-600 text-white">
      {content}
    </div>
  </div>
);

const AIMessage = ({ content }: { content: string }) => (
  <div className="p-2 rounded-lg flex gap-2 items-start">
    <div className="h-8 w-8 rounded-full flex-shrink-0 bg-gradient-to-br from-green-500 to-violet-600"></div>
    <div className="text-sm px-2 py-2 rounded-lg shadow-derek w-fit bg-white text-black">
      <Markdown>{content}</Markdown>
    </div>
  </div>
);
