// src/utils/customerCare.js

/**
 * Parse slug to extract brand and city
 * Example: "kent-customer-care-varanasi" → { brand: "Kent", city: "Varanasi", isCustomerCare: true }
 */
export const parseCustomerCareSlug = (slug) => {
  if (!slug || typeof slug !== "string") {
    return { brand: null, city: null, isCustomerCare: false };
  }

  const isCustomerCare = slug.includes("customer-care");

  console.log("isCustomerCare111111111",isCustomerCare);
  

  if (!isCustomerCare) {
    return { brand: null, city: null, isCustomerCare: false };
  }

  const parts = slug.split("-customer-care"); // ["kent", "-varanasi"]
  const brand = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || "Brand";
  const city = parts[1]?.replace(/^-/, "")?.charAt(0).toUpperCase() + parts[1]?.replace(/^-/, "")?.slice(1) || "City";

  return { brand, city, isCustomerCare };
};
