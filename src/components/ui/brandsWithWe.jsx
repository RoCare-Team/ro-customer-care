"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";


const brands = [
  { name: "", src: "/Brand/samsung-logo.webp" },
  { name: "", src: "/Brand/toshiba-logoo.webp" },
  { name: "", src: "/Brand/lg-logo.webp" },
  { name: "", src: "/Brand/bosch-logo.webp" },
  { name: "", src: "/Brand/Electrolux-.webp" },
  { name: "", src: "/Brand/haire-logo.webp" },
  { name: "", src: "/Brand/whirlpool.webp" },
  { name: "", src: "/Brand/sharp-logo.webp" },
  { name: "", src: "/Brand/dekin-logo.webp" },
  { name: "", src: "/Brand/kent-logo.webp" },
  { name: "", src: "/Brand/eurekha.webp" },
  { name: "", src: "/Brand/sony.webp" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const BrandsWeRepair = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Title Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <span className="text-blue-600">Brands </span>We Repair
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No matter where you bought it, we can fix it. We repair most major brands.
          </p>
        </motion.div>

        {/* Swiper Slider */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            spaceBetween={16}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="!pb-2"
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={brand.id}>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center justify-center h-20 sm:h-24">
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.src}
                      alt={brand.name}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 100px, 150px"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandsWeRepair;
