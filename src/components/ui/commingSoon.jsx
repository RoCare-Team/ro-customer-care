"use client";

import React from "react";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-white text-center px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 animate-bounce">
        🚀 Coming <span className="text-blue-600">Soon</span>
      </h1>

      <p className="text-gray-600 max-w-lg text-base md:text-lg mb-6">
        We're working hard to bring you something amazing. Stay tuned for updates!
      </p>

      <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition">
        Notify Me
      </button>
    </div>
  );
};

export default ComingSoon;
