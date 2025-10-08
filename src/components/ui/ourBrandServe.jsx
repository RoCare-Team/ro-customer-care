import React, { useState, useEffect } from "react";
import Link from "next/link";

const BrandListSection = () => {
  const [brands, setBrands] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // top 5 initially
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSeletedBrands] = useState([]);



  useEffect(() => {
    async function fetchAllBrands() {
      try {
        const response = await fetch("/api/getBrands");
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error("API fetch error:", errData.error || response.statusText);
        }
      } catch (err) {
        console.error("Error fetching brand list:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllBrands();
  }, []);

  const preferredBrands = ["Kent", "aqua", "Doctor-Fresh"];

  // Sort brands: preferred first, then others
  const sortedBrands = [
    ...preferredBrands.map((b) =>
      brands?.find((brand) => brand.brand === b)
    ).filter(Boolean),
    ...brands.filter((brand) => !preferredBrands.includes(brand.brand))
  ];


  const handlerBrands = () => {
    console.log("SElected");
    
  }

  const handleViewMore = () => setVisibleCount(sortedBrands.length);
  const handleViewLess = () => setVisibleCount(5);

  if (loading)
    return <div className="text-center py-12 text-xl text-gray-600">Loading brands...</div>;

  if (!brands || brands.length === 0)
    return <div className="text-center py-12 text-xl text-yellow-600">No brands are available.</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-blue-800 mb-12">
          Our Trusted Brands
        </h2>

<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
  {sortedBrands.slice(0, visibleCount).map((brand, idx) => {
    // ✅ Correct the URL if it's kent-ro-service-memari
    const redirectUrl =
      brand.main_url === "kent-ro-service-memari"
        ? "kent-ro-service"
        : brand.main_url || "#";

    return (
      <Link
        key={idx}
        href={`/${redirectUrl}`}
        legacyBehavior
        onClick={handlerBrands}
      >
        <a className="relative flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition duration-300 group">
          <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-800 text-center">
            {brand.brand}
          </h3>
        </a>
      </Link>
    );
  })}
</div>


        {sortedBrands.length > 5 && (
          <div className="text-center mt-8">
            {visibleCount < sortedBrands.length ? (
              <button
                onClick={handleViewMore}
                className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
              >
                View More
              </button>
            ) : (
              <button
                onClick={handleViewLess}
                className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
              >
                View Less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandListSection;
