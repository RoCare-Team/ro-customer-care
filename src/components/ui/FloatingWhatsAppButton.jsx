"use client";

import { FaWhatsapp } from "react-icons/fa6";

export default function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/919876543210" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center justify-center 
        w-14 h-14 
        bg-green-500 text-white 
        rounded-full shadow-xl 
        transform transition-all duration-300 
        hover:scale-110 hover:shadow-2xl hover:bg-green-600
        active:scale-95
        ring-4 ring-green-400/50
        animate-pulse
      "
    >
      <FaWhatsapp className="w-8 h-8" />
    </a>
  );
}
