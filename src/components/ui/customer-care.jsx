"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import CustomerSupport from "../../../public/images/customer-help.webp";

const PhoneIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.3 2.9l-1.6 1.6c-.3.3-.4.8-.2 1.2l.9 2.5c.1.3 0 .7-.2 1l-2.7 2.7c-1.3 1.3-3.4 1.3-4.7 0l-2.7-2.7c-.3-.3-.7-.4-1-.2l-2.5.9c-.4.1-.8.1-1.2-.2l-1.6-1.6c-.4-.4-.6-1-.2-1.4L4 3.7c.4-.4 1-.6 1.4-.2l1.6 1.6c.2.2.3.5.2.8L6.4 7c-.1.3 0 .5.2.7l2.7 2.7c.8.8 2.1.8 2.9 0l2.7-2.7c.2-.2.4-.3.7-.2l2.5.9c.3.1.5 0 .7-.2l1.6-1.6c.4-.4.2-1-.2-1.4l-3.2-3.2c-.4-.4-1-.4-1.4 0zM7 21a2 2 0 01-2-2v-2h2v2h2v2H7z" />
  </svg>
);

const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5zm16 1.7L12 12 5 6.7V5h14v1.7zm0 11.6V8.5l-6.5 6.5c-.3.3-.8.3-1.1 0L5 8.5v9.8h14z" />
  </svg>
);

const customerCareData = [
  { brand: "All", slug: "ro-customer-care", logo: CustomerSupport, title: "All Brand Customer Support Services" },
  { brand: "Kent", slug: "kent-customer-care", logo: CustomerSupport, title: "Kent RO Customer Support – Contact Details", helpline: "+91 9278912345", email: "service@kent.co.in" },
  { brand: "Blue Star", slug: "blue-star-customer-care", logo: CustomerSupport, title: "Blue Star Water Purifier Customer Care", helpline: "08075781177", email: "customerservice@bluestarindia.com" },
  { brand: "Livpure", slug: "livpure-customer-care", logo: CustomerSupport, title: "Livpure RO Water Helpline Number", helpline: "08068493939", email: "wecare@livpure.in" },
  { brand: "LG", slug: "lg-customer-care", logo: CustomerSupport, title: "LG RO Purifier Customer Support", helpline: "080 6937 9999 / +91 18001809999", email: "serviceindia@lg.com" },
  { brand: "Pureit", slug: "pureit-customer-care", logo: CustomerSupport, title: "Pureit Service Helpline Number", helpline: "+91 1860 210 1000", email: "pureit@woshin.com" },
];

const CustomerCarePage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentSlug = pathname.split("/").pop();
  const [selectedBrand, setSelectedBrand] = useState(customerCareData[0]);

  useEffect(() => {
    const foundBrand = customerCareData.find(
      (b) => b.slug.toLowerCase() === currentSlug?.toLowerCase()
    );
    if (foundBrand) setSelectedBrand(foundBrand);
    else setSelectedBrand(customerCareData[0]);
  }, [currentSlug]);

  const individualBrands = customerCareData.filter((b) => b.brand !== "All");

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    router.replace(`/${brand.slug}`); // ✅ change URL without adding history entry
  };

  const BrandDetailCard = ({ brand }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] flex flex-col md:flex-row items-center gap-8">
      <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-xl shadow">
        <Image src={brand.logo} alt={brand.brand} width={180} height={180} className="object-cover w-full h-full" />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{brand.title}</h3>
        <ul className="space-y-3">
          {brand.helpline && (
            <li className="flex items-center justify-center md:justify-start text-lg text-blue-600 font-semibold">
              <PhoneIcon className="w-6 h-6 mr-3" />
              <a href={`tel:${brand.helpline.replace(/[^0-9+]/g, "")}`}>{brand.helpline}</a>
            </li>
          )}
          {brand.email && (
            <li className="flex items-center justify-center md:justify-start text-base text-gray-700">
              <MailIcon className="w-6 h-6 mr-3" />
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
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-20 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-3">Select Brand</h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {customerCareData.map((brand) => {
                  const isSelected = selectedBrand?.brand === brand.brand;
                  return (
                    <div
                      key={brand.brand}
                      onClick={() => handleBrandClick(brand)}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold text-center ${
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

          {/* Brand Details */}
          <div className="col-span-12 lg:col-span-9">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
              {selectedBrand.title}
            </h1>

            {selectedBrand.brand === "All" ? (
              <div className="space-y-8">
                {individualBrands.map((b) => (
                  <BrandDetailCard key={b.brand} brand={b} />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
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
