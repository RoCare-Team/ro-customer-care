import { useCallback, useEffect, useState, useRef } from "react";
import { ShoppingCart, Plus, Minus, Clock, Shield, Award, Wrench, Droplets, Check, Star, Phone, User, Truck, Zap, CheckCircle, X, Grid } from "lucide-react";
import LoginPopup from "@/components/ui/login";
import { useRouter } from "next/router";
import AwardCertifications from "@/components/ui/AwardCertificate";
import ROServiceContent from "@/components/ui/serviceContent";
import BlueNearbyAreas from "@/components/ui/nearbyService";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import RoServiceCare from "../../public/images/ro-care-service.png"
import { useAuth } from "@/contexts/userAuth";
import Link from "next/link";
import FaqSectionRO from "@/components/ui/customerReview";
import OurBrandSection from "@/components/ui/ourBrandServe";
import { parseCustomerCareSlug } from "@/utils/customerCareValidPage";
import CustomerCarePage from "@/components/ui/customer-care";

// Service categories mapping with "All" option
const serviceCategories = [
  { id: 0, name: "All", apiName: "All", icon: Grid, color: "bg-gray-100 text-gray-600" },
  { id: 1, name: "Service", apiName: "Service", icon: Wrench, color: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Repair", apiName: "Repair", icon: Shield, color: "bg-green-100 text-green-600" },
  { id: 3, name: "AMC", apiName: "AMC", icon: Award, color: "bg-purple-100 text-purple-600" },
  { id: 4, name: "Installation", apiName: "Installation", icon: Truck, color: "bg-orange-100 text-orange-600" },
  { id: 5, name: "Un-installation", apiName: "Un-installation", icon: Zap, color: "bg-red-100 text-red-600" }
];

export default function ROServicePage() {
  const router = useRouter();
  const [allServices, setAllServices] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const { slug } = router.query;
  const [city, setCity] = useState("");
  const [invalid, setInvalid] = useState(false);
  const { isLoggedIn, handleLoginSuccess } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const { brand, isCustomerCare } = parseCustomerCareSlug(slug);

  console.log("isCustomerCare", isCustomerCare);


  const [pageData, setPageData] = useState(null);

  // const cityWase


  // Ref for auto-scroll
  const servicesRef = useRef(null);
  // const slugCity = slug ? slug.toString().replace("brands");

  // City data
  const popularCities = [
    "Gurgaon",
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Noida",
    "Ghaziabad",
    "Faridabad",
    "Surat",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Thane",
    "Patna",
    "Indore",
    "Bhopal",
    "Ranchi",
    "Greater Noida",
    "Meerut",
    "Varanasi",
    "Allahabad",
    "Prayagraj",
    "Chandigarh",
  ];


  //   function capitalizeWords(str) {
  //   return str
  //     .split("-")
  //     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  //     .join(" ");
  // }

  // // Example slug
  // const parts = slug?.split("-");

  // const brand = capitalizeWords(parts[0]); // "Kent"
  // const category = capitalizeWords(parts.slice(1, parts.length - 1).join("-")); // "Customer Care"
  // const citys = capitalizeWords(parts.slice(-1).join("-")); // "Delhi"

  // console.log("Brand:", brand);       // Kent
  // console.log("Category:", category); // Customer Care
  // console.log("City:", citys);         // Delhi44





  // Load cart data from localStorage
  const loadCartFromStorage = useCallback(() => {
    try {
      const storedCart = localStorage.getItem("checkoutState");

      if (storedCart) {
        // Check if storedCart is a valid JSON string
        let cartDetails;
        try {
          cartDetails = JSON.parse(storedCart);
        } catch (parseError) {
          console.warn("checkoutState in localStorage is invalid JSON:", storedCart);
          setCartData([]);
          return;
        }

        // Ensure cartDetails is an object or array
        if (typeof cartDetails !== "object" || cartDetails === null) {
          console.warn("checkoutState is not a valid object or array:", cartDetails);
          setCartData([]);
          return;
        }

        // Extract cart items from the API response structure
        const cartItems = [];

        if (Array.isArray(cartDetails)) {
          // Handle array format
          cartDetails.forEach(leadType => {
            if (leadType.cart_dtls && Array.isArray(leadType.cart_dtls)) {
              cartItems.push(...leadType.cart_dtls);
            }
          });
        } else if (cartDetails.cart_dtls && Array.isArray(cartDetails.cart_dtls)) {
          // Handle single object format
          cartItems.push(...cartDetails.cart_dtls);
        }

        setCartData(cartItems);
      } else {
        setCartData([]);
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      setCartData([]);
    }
  }, []);


  // City validation effect
  // useEffect(() => {
  //   if (!slug) return;

  //   if (slug === "ro-service") {
  //     setCity("");
  //     setInvalid(false);
  //     return;
  //   }

  //   const cityFromSlug = slug.replace("ro-service-", "").toLowerCase();
  //   const matchedCity = cities.find(c => c.toLowerCase() === cityFromSlug);

  //   if (matchedCity) {
  //     setCity(matchedCity);
  //     setInvalid(false);
  //   } else {
  //     setCity("");
  //     setInvalid(true);
  //   }
  // }, [slug]);

  // Load cart on component mount and when cartLoaded changes
  useEffect(() => {
    if (isLoggedIn) {
      loadCartFromStorage();
    } else {
      setCartData([]);
    }
  }, [isLoggedIn, cartLoaded, loadCartFromStorage]);

  // Fetch services from API
  const fetchServices = useCallback(async (leadType = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead_type: leadType })
        }
      );

      if (!response.ok) throw new Error('Failed to fetch services');

      const data = await response.json();

      const formattedServices = data.service_details?.map((service) => ({
        id: service.id,
        service_id: service.id,
        service_name: service.service_name,
        description: service.description,
        price: parseInt(service.price) || 0,
        price_without_discount: parseInt(service.price_without_discount) || parseInt(service.price) || 0,
        image: service.image || "/api/placeholder/150/120",
        status: service.status || "1",
        duration: "45 mins",
        warranty: "3 months"
      })) || [];

      setAllServices(formattedServices);
      setCategoryTitle(data.Title || 'Available Services');

    } catch (error) {
      console.error('Error fetching services:', error);
      setAllServices([]);
      setCategoryTitle('Services');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // string ke har word ka first letter capital

  // Memoized function to fetch page data
  const getPageData = useCallback(async (pageUrl) => {
    const url = pageUrl || (Array.isArray(slug) ? slug[0] : slug);
    if (!url) return null;

    try {
      const response = await fetch(`/api/getPage?page_url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        console.error("Failed to fetch page data:", response.status);
        return null;
      }

      const data = await response.json();
      console.log("Page data fetched:", data);
      setPageData(data)
      return data;
    } catch (error) {
      console.error("Error fetching page data:", error);
      return null;
    }
  }, [slug]);

  // ✅ Always call useEffect; handle slug check inside
  // ✅ Always call useEffect; handle slug check inside
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPageData();
      setPageData(data);
    };

    fetchData();
  }, [slug, getPageData]);

  console.log("pageData", pageData);


  function safeCapitalize(str) {
    if (!str) return "";
    return str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }



  // Handle cart actions
  const handleCartAction = useCallback(async ({ serviceId, operation, currentQuantity = 0 }) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      setPendingCartAction({ serviceId, operation, currentQuantity });
      return;
    }

    const customerId = localStorage.getItem("customer_id");
    if (!customerId) {
      setOpenLoginModal(true);
      setPendingCartAction({ serviceId, operation, currentQuantity });
      return;
    }

    try {
      const payload = {
        service_id: serviceId,
        type: operation === "remove" ? "delete" : operation,
        cid: customerId,
        quantity: operation === "add" ? currentQuantity + 1
          : operation === "delete" ? Math.max(0, currentQuantity - 1) : 0,
        source: 'Ro Customer Service Care'
      };

      console.log("Cart action payload:", payload);

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("checkoutState", data)
        console.log("Cart API response:", data);

        if (data.AllCartDetails) {
          localStorage.setItem("checkoutState", JSON.stringify(data.AllCartDetails));
          localStorage.setItem("cart_total_price", data.total_price || data.total_main || 0);

          // Trigger cart reload
          setCartLoaded(prev => !prev);
        }
      } else {
        console.error("Cart API failed:", res.status);
      }
    } catch (error) {
      console.error("Cart update failed:", error);
    }
  }, [isLoggedIn]);

  // Handle login success and execute pending cart action
  const onLoginSuccess = useCallback((userData) => {
    handleLoginSuccess(userData);

    // Execute pending cart action if exists
    if (pendingCartAction) {
      const { serviceId, operation, currentQuantity } = pendingCartAction;
      handleCartAction({ serviceId, operation, currentQuantity });
      setPendingCartAction(null);
    }
  }, [handleLoginSuccess, pendingCartAction, handleCartAction]);

  // Add to cart handler
  // Add to cart
  const handleAddToCart = useCallback((service) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return; // Stop execution if not logged in
    }

    const existingItem = cartData.find(item => item.service_id === service.id);
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    handleCartAction({
      serviceId: service.id,
      operation: "add",
      currentQuantity
    });

    if (!existingItem) {
      // Add to local cartData for UI
      setCartData(prev => [...prev, { service_id: service.id, quantity: 1 }]);
    }
  }, [cartData, handleCartAction, setCartData, isLoggedIn]); // include isLoggedIn in dependencies


  // Increase quantity
  const handleIncreaseQty = useCallback(async (service) => {
    const existingItem = cartData.find(item => item.service_id === service.id);
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    try {
      await handleCartAction({
        serviceId: service.id,
        operation: "add",
        currentQuantity
      });

      // Assume handleCartAction returns the updated cartData
      const updatedCart = JSON.parse(localStorage.getItem("checkoutState") || "[]");
      setCartData(updatedCart);

    } catch (err) {
      console.error(err);
    }
  }, [cartData, handleCartAction, setCartData]);


  // Decrease quantity
  const handleDecreaseQty = useCallback((service) => {
    const existingItem = cartData.find(item => item.service_id === service.id);
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    if (!existingItem) return;

    if (currentQuantity <= 1) {
      // Remove completely
      handleCartAction({
        serviceId: service.id,
        operation: "remove",
        currentQuantity: 0
      });

      setCartData(prev => prev.filter(item => item.service_id !== service.id));
    } else {
      // Decrease by 1
      handleCartAction({
        serviceId: service.id,
        operation: "delete",
        currentQuantity
      });

      setCartData(prev =>
        prev.map(item =>
          item.service_id === service.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  }, [cartData, handleCartAction, setCartData]);

  // Parse HTML description
  const parseDescription = (htmlString) => {
    if (!htmlString) return [];

    // Remove HTML tags and extract list items
    const cleanText = htmlString.replace(/<[^>]*>/g, '').replace(/\t/g, '');
    return cleanText.split('\n').filter(item => item.trim().length > 0);
  };

  // Handle category selection with auto-scroll
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);

    // Auto-scroll to services section
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Filter services based on selected category
  const filteredServices =
    selectedCategory === 0
      ? allServices // Show all services when "All" is selected
      : allServices.filter(service => {
        const category = serviceCategories.find(cat => cat.id === selectedCategory);
        if (!category) return false;

        // Special logic for AMC
        if (category.apiName === "AMC") {
          return service.service_name.includes("AMC Plan");
        }

        // Default logic for other categories
        return service.service_name === category.apiName;
      });

  // Get current category name
  const currentCategoryName = serviceCategories.find(cat => cat.id === selectedCategory)?.name || "All Services";

  // Calculate cart totals
  const totalPrice = cartData.reduce((total, item) => {
    const price = parseInt(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  const totalItems = cartData.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);

  // Helper function to check if service is in cart
  const getCartItemForService = useCallback((service) => {
    return cartData.find(item =>
      item.service_id === service.id ||
      item.service_id === service.service_id
    );
  }, [cartData]);




   
  useEffect(() => {
    if (!slug) return;

    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/getBrands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ only set loading false after fetching
      }
    };

    fetchBrands();
  }, [slug]);

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Water Drop Spinner */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-500 animate-pulse"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C12 2 7 8 7 12.5C7 16.09 9.91 19 13.5 19C17.09 19 20 16.09 20 12.5C20 8 15 2 15 2H12Z" />
          </svg>
        </div>
      </div>

      {/* Text Animation */}
      <p className="mt-6 text-lg md:text-xl font-semibold text-blue-600 animate-pulse">
        Loading RO Customer Care...
      </p>
    </div>
  );
}


  const validCities = [
    "gurgaon", "delhi", "mumbai", "bangalore", "hyderabad", "ahmedabad",
    "chennai", "kolkata", "noida", "ghaziabad", "faridabad", "surat", "pune",
    "jaipur", "lucknow", "kanpur", "thane", "patna", "indore", "bhopal",
    "ranchi", "greater-noida", "meerut", "varanasi", "allahabad", "prayagraj",
    "chandigarh"
  ];

  const normalizedSlug = slug?.replace(/\/$/, "").trim().toLowerCase();

  // ✅ Check if slug matches any brand page_url
  const matchBrand = brands.find((brand) =>
    brand.page_urls?.some((url) => url.trim().toLowerCase() === normalizedSlug)
  );

  // ✅ Check if slug matches valid patterns
  let matchesValidPattern = false;
  if (normalizedSlug === "ro-customer-care" || normalizedSlug === "ro-service") {
    matchesValidPattern = true;
  }
  if (normalizedSlug?.startsWith("ro-customer-care-")) {
    const city = normalizedSlug.replace("ro-customer-care-", "");
    matchesValidPattern = validCities.includes(city);
  }
  if (normalizedSlug?.startsWith("ro-service-")) {
    const city = normalizedSlug.replace("ro-service-", "");
    matchesValidPattern = validCities.includes(city);
  }

  // ✅ Only show 404 if data loaded and no match found
  if (!matchBrand && !matchesValidPattern) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 text-center">
        <div className="bg-red-100 p-6 rounded-full mb-6 shadow-lg animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-600 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-lg mb-6">
          The page you are looking for doesn&apos;t exist. Please check the URL or go back to the homepage.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬅ Go Back
          </button>

          <a
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition"
          >
            🏠 Home
          </a>
        </div>
      </div>
    );
  }

// ✅ Render brand page or valid pattern page here


    




  // const slugFilter = slug.split("-")
  // console.log("slugFilter",slugFilter);


  // Service page: add to cart button or checkout buttons


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-0 md:mt-16">
        <div className="max-w-7xl mx-auto p-6">
          {!isCustomerCare ? (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Sidebar - Service Categories - STICKY */}
              <div className="lg:col-span-3">
                <div className="sticky top-20 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">{pageData?.page_name}</p>
                      {/* <p className="text-xs text-gray-600"></p> */}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    {serviceCategories.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = selectedCategory === category.id;
                      return (
                        <div
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`w-12 h-12 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : category.color
                            } flex items-center justify-center mb-2 transition-all`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <span className={`text-xs font-medium text-center transition-all ${isSelected ? 'text-blue-600' : 'text-gray-700'
                            }`}>{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content - Hero and Services - SCROLLABLE */}
              <div className="lg:col-span-6">
                {/* Hero Section */}
                <Image
                  src={RoServiceCare}
                  alt="RO-Customer-Care-banner-image"
                  priority
                  loading="eager"
                  className="hidden md:block rounded-xl shadow-lg object-contain mb-4"
                />

                {/* Services Section */}
                <div ref={servicesRef} className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{currentCategoryName}</h2>
                    <div className="text-sm text-gray-500">
                      {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                              <div className="h-6 bg-gray-200 rounded mb-3"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="lg:w-48 flex flex-col items-center gap-4">
                              <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
                              <div className="w-20 h-8 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                      <div className="text-gray-400 mb-4">
                        <Wrench className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Available</h3>
                      <p className="text-gray-500">Services for this category will be available soon.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredServices.map((service) => {
                        const cartItem = getCartItemForService(service);
                        const inCart = !!cartItem;
                        const quantity = cartItem ? parseInt(cartItem.quantity) || 0 : 0;

                        return (
                          <div key={service.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="flex flex-row gap-4 p-3 rounded-xl border border-gray-200 shadow-sm">
                              {/* Service Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    {service.service_name}
                                  </h3>
                                  {inCart && (
                                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                                      Added ({quantity})
                                    </span>
                                  )}
                                </div>

                                <ul className="space-y-1 text-gray-700 text-xs sm:text-sm mb-3">
                                  {parseDescription(service.description).map((point, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span className="text-gray-400 mt-0.5">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Duration + Warranty */}
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

                                {/* Discount */}
                                {service.price_without_discount > service.price && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 line-through">
                                      ₹{service.price_without_discount}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                                      Save ₹{service.price_without_discount - service.price}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Image + Price + Button */}
                              <div className="w-28 sm:w-40 flex flex-col items-center gap-2">
                                <div className="w-20 h-16 sm:w-28 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
                                  {service.image && service.image !== "/api/placeholder/150/120" ? (
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

                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>



              {/* Right Sidebar - Cart and Info - STICKY */}
              <div className="lg:col-span-3">
                <div className="section-heading">
                  <strong>Best and Qualified RO Water Purifier Services in India.</strong>
                  <p>
                    Get connected with the industry's best. RO Customer Care Service provides a nationwide network of trained and skilled experts. We solve your RO water purifier related issues swiftly and ensure you get the best quality of drinking water.
                  </p>
                </div>
                <div className="sticky top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  {/* Cart Section */}
                  <div className="bg-white rounded-lg shadow-sm hidden sm:block">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
                        {totalItems > 0 && (
                          <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
                            {totalItems}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      {cartData.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No services added.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cartData.map((item, index) => {
                            const service = allServices.find(s => s.id == item.service_id);
                            const serviceName = item.service_name || service?.service_name || 'Service';
                            const servicePrice = parseInt(item.price) || 0;
                            const serviceQuantity = parseInt(item.quantity) || 0;

                            return (
                              <div key={index} className="border border-gray-200 rounded-lg p-3">
                                <h4 className="font-medium text-gray-900 mb-2">{serviceName}</h4>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-blue-600 font-semibold">₹{servicePrice}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => service && handleDecreaseQty(service)}
                                      className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="font-medium min-w-[20px] text-center">{serviceQuantity}</span>
                                    <button
                                      onClick={() => service && handleIncreaseQty(service)}
                                      className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <span className="font-semibold">₹{servicePrice * serviceQuantity}</span>
                                </div>
                              </div>
                            );
                          })}

                          {/* Cart Total and Checkout */}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-semibold">Total</span>
                              <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                            </div>
                            <Link href="/checkout">
                              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                Proceed to Checkout ({totalItems} items)
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>



                  {/* Why Choose Us Section */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Why Choose Us</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Expert Professionals</p>
                          <p className="text-xs text-gray-600">Certified technicians with years of experience</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Doorstep Service</p>
                          <p className="text-xs text-gray-600">We come to you at your convenience</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Quick Service</p>
                          <p className="text-xs text-gray-600">Same day or next day service available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : <CustomerCarePage />}
          <AwardCertifications />
          <ROServiceContent pageData={pageData} />

          <div className="max-w-9xl mx-auto p-2">
            {/* ✅ Popular Cities Section */}
            <section className="bg-white rounded-xl shadow-md p-2">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Service in Popular Cities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {popularCities.map((city, idx) => {
                  // city slug
                  const slugCity = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                  // Strip the city from the existing slug (if any)
                  const brandSlug = slug?.split("-").filter(part => !popularCities
                    .map(c => c.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
                    .includes(part)
                  ).join("-");

                  // Build the final URL
                  const href = `${brandSlug}-${slugCity}`;

                  return (
                    <Link
                      key={idx}
                      href={href}
                      className="px-3 py-2 border rounded-lg bg-gray-50 hover:bg-blue-50 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    >
                      {safeCapitalize(brandSlug)} Service {city}
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>


          <FaqSectionRO />

          <BlueNearbyAreas />
          <OurBrandSection />
        </div>
      </div>
      <Footer />
      <LoginPopup
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onLoginSuccess={onLoginSuccess}
      />



      {/* Mobile View Cart Button - Only for sm screens */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 block md:hidden z-50" style={{ marginBottom: "85px" }}>
          <Link href="/checkout">
            <button className="bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center gap-4 px-6 py-3 min-w-[220px]">
              {/* Left circle */}
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>

              {/* Text */}
              <div className="text-center">
                <div className="font-semibold text-sm">View cart</div>
                <div className="text-xs font-medium">
                  {totalItems} ITEM{totalItems !== 1 ? "S" : ""}
                </div>
              </div>

              {/* Right circle */}
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </Link>
        </div>
      )}
    </>
  );
}