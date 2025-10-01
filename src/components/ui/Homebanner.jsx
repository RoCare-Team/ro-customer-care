// components/CommonBanner.js

import { Droplet } from "lucide-react";
import Link from "next/link";
import HeroImage from "../../../public/images/hero-section-022.png";
import Image from "next/image";

const CommonBanner = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-white to-blue-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <span className="inline-block px-4 py-1 text-sm text-gray-600 bg-gray-100 rounded-full mb-4">
            Pure water • Zero hassle
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mb-4">
            Pure Water, Zero Hassle – RO Care Made Effortless
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Book expert RO service, repair, installation, or AMC with
            transparent prices and same-day slots.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start">
            <Link
              href="/ro-service"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              See RO Services
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 text-center md:text-left">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">On-time</p>
              <p className="text-xl font-semibold text-gray-900">97%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Warranty</p>
              <p className="text-xl font-semibold text-gray-900">7-day</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-xl font-semibold text-gray-900">4.5★</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <Image src={HeroImage} alt="Hero" className="max-w-full h-auto" />
        </div>
      </div>
    </section>
  );
};

export default CommonBanner;
