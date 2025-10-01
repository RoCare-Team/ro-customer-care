"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const stores = [
  {
    name: "Delhi RO Service Center",
    address: "Connaught Place, New Delhi, India",
    timings: "9 AM - 7 PM",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112221.45084512027!2d77.54547199999999!3d28.481945599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfc0e1234567%3A0xabcd!2sConnaught%20Place!5e0!3m2!1sen!2sin!4v1758964197547!5m2!1sen!2sin",
  },
  {
    name: "Mumbai RO Service Center",
    address: "Bandra, Mumbai, India",
    timings: "10 AM - 8 PM",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609862346!2d72.74109999999999!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6301234567%3A0xabcd!2sBandra!5e0!3m2!1sen!2sin!4v1758964299999!5m2!1sen!2sin",
  },
  {
    name: "Bangalore RO Service Center",
    address: "MG Road, Bangalore, India",
    timings: "9 AM - 6 PM",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.11609862346!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1234567%3A0xabcd!2sMG%20Road!5e0!3m2!1sen!2sin!4v1758964399999!5m2!1sen!2sin",
  },
];

const StoreLocator = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleMap = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Our RO Service Centers
      </h2>

      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={3}
        pagination={{ clickable: true }}
        className="pb-10"
      >
        {stores.map((store, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white/90 backdrop-blur-md border border-blue-200 rounded-2xl shadow-lg flex flex-col justify-between h-[28rem] w-full transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 px-4 pt-4">
                  {store.name}
                </h3>
                <p className="text-gray-700 mb-1 px-4">
                  <span className="font-semibold">Address: </span>
                  {store.address}
                </p>
                <p className="text-gray-700 mb-4 px-4">
                  <span className="font-semibold">Timings: </span>
                  {store.timings}
                </p>
              </div>

              <div className="px-4 pb-4">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
                  onClick={() => toggleMap(idx)}
                >
                  {expandedIndex === idx ? "Hide Map" : "View Map"}
                </button>

                {expandedIndex === idx && (
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-blue-300 mt-2">
                    <iframe
                      src={store.mapEmbed}
                      className="w-full h-full"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StoreLocator;
