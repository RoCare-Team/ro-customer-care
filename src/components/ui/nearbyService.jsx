"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

const PinIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2C8 2 5 5 5 9c0 6 7 12 7 12s7-6 7-12c0-4-3-7-7-7z" fill="currentColor" />
    <circle cx="12" cy="9" r="2.2" fill="white" />
  </svg>
);

const CityPill = ({ city }) => {
  const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const href = `/ro-service-${slug}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all duration-200"
      aria-label={`Open services in ${city}`}
    >
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white">
        <PinIcon />
      </span>
      <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[12ch]">
        {city}
      </span>
    </Link>
  );
};

const PillGrid = ({ cities, showAll }) => {
  const items = showAll ? cities : cities.slice(0, 8);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {items.map((c, idx) => (
        <CityPill key={idx} city={c} />
      ))}
    </div>
  );
};

export default function BlueNearbyAreas({ currentCity = "Delhi" }) {
  const [showAll, setShowAll] = useState(false);

  const nearby = useMemo(
    () => [
      "Mumbai",
      "Agra",
      "Bangalore",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Pune",
      "Ahmedabad",
      "Jaipur",
      "Surat",
      "Lucknow",
      "Kanpur",
      "Nagpur",
      "Indore",
      "Thane",
      "Bhopal",
      "Visakhapatnam",
      "Pimpri-Chinchwad",
      "Patna",
    ],
    []
  );

  const toggleShow = () => setShowAll((s) => !s);
  const extraCount = Math.max(0, nearby.length - 8);

  return (
    <div className="max-w-8xl mx-auto px-3 sm:px-4 mt-10">
      <section className="bg-white rounded-xl shadow-md p-5 sm:p-8">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            Our RO Service Centers
          </h2>
          <div className="mx-auto mt-2 w-20 h-1 rounded-full bg-gray-700" />
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            We bring our top-rated home services to neighborhoods around{" "}
            <span className="font-semibold text-gray-800">{currentCity}</span>.
          </p>
        </div>

        {/* Pills */}
        <div className="mt-4">
          <PillGrid cities={nearby} showAll={showAll} />
          {nearby.length > 8 && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={toggleShow}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300 shadow"
                aria-expanded={showAll}
              >
                {showAll ? "Show Less" : `Show More (${extraCount} more)`}
              </button>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Tip: Click any area to explore services available there.
        </div>
      </section>
    </div>
  );
}
