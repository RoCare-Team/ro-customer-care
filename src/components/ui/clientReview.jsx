"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react"; // nice star icons
import AvatorIcon from "../../../public/images/avatorImage.jpg"

// Sample Reviews Data (You can fetch from API or CMS later)
const reviews = [
  {
    id: 1,
    name: "Amit Sharma",
    location: "Gurgaon",
    review:
      "Amazing service! The team was super professional and completed the RO installation quickly. Highly recommended!",
    rating: 5,
    avatar: AvatorIcon,
  },
  {
    id: 2,
    name: "Neha Kapoor",
    location: "Delhi",
    review:
      "Customer support was great and they explained everything clearly. Very satisfied with their service.",
    rating: 4,
    avatar: AvatorIcon,
  },
  {
    id: 3,
    name: "Rohit Verma",
    location: "Noida",
    review:
      "On-time service and very polite staff. I will definitely book them again in future.",
    rating: 5,
    avatar: AvatorIcon,
  },
];

export default function ClientReviews() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-12 max-w-7xl mx-auto py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What Our Clients Say
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelected(review.id)}
            >
              {/* User Info */}
              <div className="flex items-center mb-4">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <p className="text-gray-500 text-sm">{review.location}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed">{review.review}</p>
            </div>
          ))}
        </div>

        {/* Optional: Show selected review in a modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={() => setSelected(null)}
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">
                {reviews.find((r) => r.id === selected)?.name}
              </h3>
              <p className="text-gray-700">
                {reviews.find((r) => r.id === selected)?.review}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
