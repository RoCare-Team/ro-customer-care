"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Example suggested services (will be returned by AI / pre-defined)
  const suggestedServices = [
    { name: "RO Service Care", url: "/ro-service-care" },
    { name: "RO Customer Care", url: "/kent-customer-care" },
    // { name: "Pipeline Services", url: "/pipeline-services" },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/openai/aiGenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage = { sender: "ai", text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("OpenAI API error:", err);
      const errorMsg = { sender: "ai", text: "Oops! Something went wrong." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 right-5 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl z-50"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute w-2 h-2 bg-white rounded-full top-2 right-2 animate-ping"></span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end">
          <div className="bg-white w-full md:w-96 h-[500px] rounded-tl-xl rounded-bl-xl shadow-xl p-4 flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">Chat Support</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto border-t border-gray-200 pt-2 space-y-2 flex flex-col">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === "user"
                      ? "bg-blue-100 text-gray-900 self-end"
                      : "bg-gray-100 text-gray-900 self-start"
                    }`}
                >
                  {msg.text}

                  {/* Show suggested services only for AI messages */}
                  {msg.sender === "ai" && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestedServices.map((service, i) => (
                        <a
                          key={i}
                          href={service.url}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700 transition"
                        >
                          {service.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && <p className="text-gray-500 text-sm">typing...</p>}
            </div>

            {/* Input box */}
            <div className="mt-2 flex">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
