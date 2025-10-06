"use client";

import Image from "next/image";
import { ShoppingCart, Minus, Plus, Wrench, Clock, Shield } from "lucide-react";
import { parseCustomerCareSlug } from "@/utils/customerCare";

const ServicesOrCustomerCare = ({ slug, filteredServices, isLoading, cartData, handleAddToCart, handleIncreaseQty, handleDecreaseQty }) => {
  const { brand, city, isCustomerCare } = parseCustomerCareSlug(slug);

  // Helper for customer care dummy data
  const customerCareServices = [
    {
      id: "cc1",
      title: "Book a Service",
      description: [`Schedule a service appointment for ${brand} in ${city}`],
      icon: <ShoppingCart className="h-5 w-5 text-blue-600" />,
    },
    {
      id: "cc2",
      title: "Check Service Status",
      description: [`Check current status of your booked service in ${city}`],
      icon: <Clock className="h-5 w-5 text-gray-600" />,
    },
    {
      id: "cc3",
      title: "Request AMC",
      description: [`Request Annual Maintenance Contract for ${brand} in ${city}`],
      icon: <Shield className="h-5 w-5 text-green-600" />,
    },
    {
      id: "cc4",
      title: "FAQs",
      description: [`Frequently asked questions for ${brand} customer care`],
      icon: <Wrench className="h-5 w-5 text-red-600" />,
    },
  ];

  // Decide what to render
  const displayList = isCustomerCare ? customerCareServices : filteredServices;

  return (
    <div className="space-y-4">
      {(isLoading && !isCustomerCare) ? (
        // Skeleton loading only for real services
        [1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))
      ) : displayList.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 mb-4">
            <Wrench className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {isCustomerCare ? "Customer Care Unavailable" : "No Services Available"}
          </h3>
          <p className="text-gray-500">
            {isCustomerCare ? `Customer care for ${brand} in ${city} is not available yet.` : "Services for this category will be available soon."}
          </p>
        </div>
      ) : (
        displayList.map((service) => {
          const inCart = !isCustomerCare && !!cartData.find(item => item.service_id === service.id);
          const quantity = !isCustomerCare && inCart ? cartData.find(item => item.service_id === service.id)?.quantity || 0 : 0;

          return (
            <div key={service.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex flex-row gap-4 p-3 rounded-xl border border-gray-200 shadow-sm">
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {isCustomerCare ? service.title : service.service_name}
                    </h3>
                    {inCart && (
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                        Added ({quantity})
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1 text-gray-700 text-xs sm:text-sm mb-3">
                    {(isCustomerCare ? service.description : parseDescription(service.description)).map((point, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {!isCustomerCare && (
                    <div className="flex items-center gap-3 text-[11px] sm:text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {service.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {service.warranty} warranty
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Image / Icon / Button */}
                <div className="w-28 sm:w-40 flex flex-col items-center gap-2">
                  <div className="w-20 h-16 sm:w-28 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {isCustomerCare ? (
                      service.icon
                    ) : service.image && service.image !== "/api/placeholder/150/120" ? (
                      <Image
                        src={service.image}
                        alt={service.service_name}
                        className="w-full h-full object-cover"
                        width={112}
                        height={80}
                      />
                    ) : (
                      <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    )}
                  </div>

                  {!isCustomerCare && (
                    <>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          ₹{service.price}
                        </div>
                      </div>

                      {!cartData.find(item => item.service_id === service.id) ? (
                        <button
                          onClick={() => handleAddToCart(service)}
                          className="bg-blue-600 text-white text-xs sm:text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleDecreaseQty(service)}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 shadow-sm"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <span className="font-medium min-w-[20px] sm:min-w-[30px] text-center text-xs sm:text-sm">
                            {cartData.find(item => item.service_id === service.id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => handleIncreaseQty(service)}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 shadow-sm"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ServicesOrCustomerCare;
