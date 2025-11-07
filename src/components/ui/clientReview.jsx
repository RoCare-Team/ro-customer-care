"use client";

import { useState } from "react";
import { Star, User, UserRound } from "lucide-react"; // 👈 Import male/female icons
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Amit Sharma",
    location: "Gurgaon",
    review:
      "Amazing service! The team was super professional and completed the RO installation quickly. Highly recommended!",
    rating: 5,
    gender: "male",
  },
  {
    id: 2,
    name: "Neha Kapoor",
    location: "Delhi",
    review:
      "Customer support was great and they explained everything clearly. Very satisfied with their service.",
    rating: 4,
    gender: "female",
  },
  {
    id: 3,
    name: "Rohit Verma",
    location: "Noida",
    review:
      "On-time service and very polite staff. I will definitely book them again in future.",
    rating: 5,
    gender: "male",
  },
  {
    id: 4,
    name: "Simran Kaur",
    location: "Mumbai",
    review:
      "Excellent experience! The service team is knowledgeable and prompt. Great job done.",
    rating: 5,
    gender: "female",
  },
  {
    id: 5,
    name: "Vivek Yadav",
    location: "Chandigarh",
    review:
      "Smooth process from booking to completion. Really happy with the RO service quality.",
    rating: 4,
    gender: "male",
  },
];

export default function ClientReviews() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
          What Our Clients Say
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div
                onClick={() => setSelected(review.id)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                  {/* User Info */}
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      {review.gender === "female" ? (
                        <UserRound className="w-8 h-8 text-pink-500" />
                      ) : (
                        <User className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {review.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{review.location}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">
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
