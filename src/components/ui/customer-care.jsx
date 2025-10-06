"use client";

import Image from "next/image";
import { useState } from "react";
import CustomerSupport from "../../../public/images/customer-help.webp";

// --- Utility function for a simple Phone/Email icon (optional, but improves UI)
const PhoneIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.3 2.9l-1.6 1.6c-.3.3-.4.8-.2 1.2l.9 2.5c.1.3 0 .7-.2 1l-2.7 2.7c-1.3 1.3-3.4 1.3-4.7 0l-2.7-2.7c-.3-.3-.7-.4-1-.2l-2.5.9c-.4.1-.8.1-1.2-.2l-1.6-1.6c-.4-.4-.6-1-.2-1.4L4 3.7c.4-.4 1-.6 1.4-.2l1.6 1.6c.2.2.3.5.2.8L6.4 7c-.1.3 0 .5.2.7l2.7 2.7c.8.8 2.1.8 2.9 0l2.7-2.7c.2-.2.4-.3.7-.2l2.5.9c.3.1.5 0 .7-.2l1.6-1.6c.4-.4.2-1-.2-1.4l-3.2-3.2c-.4-.4-1-.4-1.4 0zM7 21a2 2 0 01-2-2v-2h2v2h2v2H7z"/>
  </svg>
);
const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5zm16 1.7L12 12 5 6.7V5h14v1.7zm0 11.6V8.5l-6.5 6.5c-.3.3-.8.3-1.1 0L5 8.5v9.8h14z"/>
  </svg>
);
// ---

const customerCareData = [
  { brand: "All", logo: CustomerSupport, title: "All Brand Customer Support Services" }, // Added a title for "All"
  { brand: "Kent", logo: CustomerSupport, title: "Kent RO Customer Support – Contact Details", helpline: "+91 9278912345", email: "service@kent.co.in" },
  { brand: "Eureka Forbes", logo: CustomerSupport, title: "Eureka Forbes Service Helpline", helpline: "7039883333", email: "customercare@eurekaforbes.com" },
  { brand: "Blue Star", logo: CustomerSupport, title: "Blue Star Water Purifier Customer Care", helpline: "08075781177", email: "customerservice@bluestarindia.com" },
  { brand: "Livpure", logo: CustomerSupport, title: "Livpure RO Water Helpline Number", helpline: "08068493939", email: "wecare@livpure.in" },
  { brand: "Doctor Fresh", logo: CustomerSupport, title: "Doctor Fresh Customer Care", helpline: "+91 9011587716", email: "info@doctorfresh.in" },
  { brand: "LG", logo: CustomerSupport, title: "LG RO Purifier Customer Support", helpline: "080 6937 9999 / +91 18001809999", email: "serviceindia@lg.com" },
  { brand: "Pureit", logo: CustomerSupport, title: "Pureit Service Helpline Number", helpline: "+91 1860 210 1000", email: "pureit@woshin.com" },
];

const CustomerCarePage = () => {
  // 1. INITIALIZE useState WITH THE 'All' BRAND DATA
  const [selectedBrand, setSelectedBrand] = useState(customerCareData[0]);

  // Filter out the 'All' item to get the list of individual brands
  const individualBrands = customerCareData.filter(brand => brand.brand !== "All");

  const BrandDetailCard = ({ brand }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-transform hover:shadow-xl hover:scale-[1.01] flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <div className="w-20 h-20 flex-shrink-0">
        <Image
          src={brand.logo}
          alt={`${brand.brand} logo`}
          width={80}
          height={80}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{brand.title}</h3>
        <ul className="space-y-3">
          {brand.helpline && (
            <li className="flex items-center justify-center sm:justify-start text-base text-blue-600 font-medium">
              <PhoneIcon className="w-5 h-5 mr-2" />
              <a href={`tel:${brand.helpline.replace(/[^0-9+]/g, '')}`}>{brand.helpline}</a>
            </li>
          )}
          {brand.email && (
            <li className="flex items-center justify-center sm:justify-start text-sm text-gray-700">
              <MailIcon className="w-5 h-5 mr-2" />
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Sticky Brand List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-20 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-3">Select Brand</h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {customerCareData.map((brand) => {
                  const isSelected = selectedBrand?.brand === brand.brand;
                  return (
                    <div
                      key={brand.brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold text-center transition-all ${
                          isSelected ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {brand.brand}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Brand Details / All Brands List */}
          <div className="col-span-12 lg:col-span-9">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
              {selectedBrand.title}
            </h1>

            {/* 2. CONDITIONALLY RENDER LIST OR SINGLE CARD */}
            {selectedBrand.brand === "All" ? (
              // Display ALL cards
              <div className="space-y-6">
                {individualBrands.map((brand) => (
                  <BrandDetailCard key={brand.brand} brand={brand} />
                ))}
              </div>
            ) : (
              // Display a SINGLE card
              <div className="space-y-6">
                <BrandDetailCard brand={selectedBrand} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCarePage;