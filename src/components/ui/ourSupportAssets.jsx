"use client";
import { useState } from "react";
import { Chat, Whatsapp } from "lucide-react"; // Lucide icons, ya aap SVG use kar sakte ho

export default function FloatingChatButtons() {
  const [hoverChat, setHoverChat] = useState(false);
  const [hoverWhatsApp, setHoverWhatsApp] = useState(false);

  return (
    <div className="fixed bottom-20 right-5 flex flex-col items-end gap-4 z-50">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210" // change to your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHoverWhatsApp(true)}
        onMouseLeave={() => setHoverWhatsApp(false)}
        className={`flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl relative`}
      >
        <Whatsapp className="w-6 h-6" />
        {/* Optional small ping animation */}
        <span className={`absolute w-2 h-2 bg-white rounded-full top-2 right-2 animate-ping ${hoverWhatsApp ? 'block' : 'hidden'}`}></span>
      </a>

      {/* Chat Support Button */}
      <button
        onClick={() => alert("Open chat support!")} // replace with modal or chat widget
        onMouseEnter={() => setHoverChat(true)}
        onMouseLeave={() => setHoverChat(false)}
        className={`flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl relative`}
      >
        <Chat className="w-6 h-6" />
        {/* Optional small ping animation */}
        <span className={`absolute w-2 h-2 bg-white rounded-full top-2 right-2 animate-ping ${hoverChat ? 'block' : 'hidden'}`}></span>
      </button>
    </div>
  );
}
