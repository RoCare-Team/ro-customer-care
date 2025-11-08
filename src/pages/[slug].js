import { useCallback, useEffect, useState, useRef } from "react";
import { ShoppingCart, Plus, Minus, Clock, Shield, Award, Wrench, Droplets, Check, Star, Phone, User, Truck, Zap, CheckCircle, X, Grid, ChevronDown } from "lucide-react";
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
import Head from "next/head";

// Service categories mapping with "All" option
const serviceCategories = [
  { id: 0, name: "All", apiName: "All", icon: Grid, color: "bg-gray-100 text-gray-600" },
  { id: 1, name: "Service", apiName: "Service", icon: Wrench, color: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Repair", apiName: "Repair", icon: Shield, color: "bg-green-100 text-green-600" },
  { id: 3, name: "AMC", apiName: "AMC", icon: Award, color: "bg-purple-100 text-purple-600" },
  { id: 4, name: "Installation", apiName: "Installation", icon: Truck, color: "bg-orange-100 text-orange-600" },
  { id: 5, name: "Un-installation", apiName: "Un-installation", icon: Zap, color: "bg-red-100 text-red-600" }
];

// Popular cities array
const popularCities = [
  "Gurgaon", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Noida", "Ghaziabad", "Faridabad", "Surat", "Pune",
  "Jaipur", "Lucknow", "Kanpur", "Thane", "Patna", "Indore", "Bhopal",
  "Ranchi", "Meerut", "Varanasi", "Allahabad", "Prayagraj", "Chandigarh",
];

const validCities = [
  "gurgaon", "delhi", "mumbai", "bangalore", "hyderabad", "ahmedabad",
  "chennai", "kolkata", "noida", "ghaziabad", "faridabad", "surat", "pune",
  "jaipur", "lucknow", "kanpur", "thane", "patna", "indore", "bhopal",
  "ranchi", "greater-noida", "meerut", "varanasi", "allahabad", "prayagraj",
  "chandigarh",
];

function safeCapitalize(str) {
  if (!str) return "";
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ROServicePage({ initialServices, initialPageData, initialBrands, slug }) {
  const router = useRouter();
  const [allServices, setAllServices] = useState(initialServices || []);
  const [cartData, setCartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [city, setCity] = useState("");
  const [invalid, setInvalid] = useState(false);
  const { isLoggedIn, handleLoginSuccess } = useAuth();
  const [brands, setBrands] = useState(initialBrands || []);
  const [isInstallation, setIsInstallation] = useState(false);
  const [open, setOpen] = useState(false);
  const { brand, isCustomerCare } = parseCustomerCareSlug(slug);
  const [pageData, setPageData] = useState(initialPageData);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const servicesRef = useRef(null);

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => setIsPageLoading(true);
    const handleRouteChangeComplete = () => setIsPageLoading(false);
    const handleRouteChangeError = () => setIsPageLoading(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  // Update state when props change (after navigation)
  useEffect(() => {
    if (initialServices) {
      setAllServices(initialServices);
    }
    if (initialPageData) {
      setPageData(initialPageData);
    }
    setIsPageLoading(false);
  }, [initialServices, initialPageData, slug]);

  // Load cart data from localStorage
  const loadCartFromStorage = useCallback(() => {
    try {
      const storedCart = localStorage.getItem("checkoutState");

      if (storedCart) {
        let cartDetails;
        try {
          cartDetails = JSON.parse(storedCart);
        } catch (parseError) {
          setCartData([]);
          return;
        }

        if (typeof cartDetails !== "object" || cartDetails === null) {
          console.warn("checkoutState is not a valid object or array:", cartDetails);
          setCartData([]);
          return;
        }

        const cartItems = [];

        if (Array.isArray(cartDetails)) {
          cartDetails.forEach(leadType => {
            if (leadType.cart_dtls && Array.isArray(leadType.cart_dtls)) {
              cartItems.push(...leadType.cart_dtls);
            }
          });
        } else if (cartDetails.cart_dtls && Array.isArray(cartDetails.cart_dtls)) {
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

  // Load cart on component mount and when cartLoaded changes
  useEffect(() => {
    if (isLoggedIn) {
      loadCartFromStorage();
    } else {
      setCartData([]);
    }
  }, [isLoggedIn, cartLoaded, loadCartFromStorage]);

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
        
        if (data.AllCartDetails) {
          localStorage.setItem("checkoutState", JSON.stringify(data.AllCartDetails));
          localStorage.setItem("cart_total_price", data.total_price || data.total_main || 0);
          setCartLoaded(prev => !prev);
        }
      }
    } catch (error) {
      console.error("Cart update failed:", error);
    }
  }, [isLoggedIn]);

  // Handle login success and execute pending cart action
  const onLoginSuccess = useCallback((userData) => {
    handleLoginSuccess(userData);

    if (pendingCartAction) {
      const { serviceId, operation, currentQuantity } = pendingCartAction;
      handleCartAction({ serviceId, operation, currentQuantity });
      setPendingCartAction(null);
    }
  }, [handleLoginSuccess, pendingCartAction, handleCartAction]);

  // Add to cart
  const handleAddToCart = useCallback((service) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }

    const existingItem = cartData.find(item => item.service_id === service.id);
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    handleCartAction({
      serviceId: service.id,
      operation: "add",
      currentQuantity
    });

    if (!existingItem) {
      setCartData(prev => [...prev, { service_id: service.id, quantity: 1 }]);
    }
  }, [cartData, handleCartAction, isLoggedIn]);

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

      const updatedCart = JSON.parse(localStorage.getItem("checkoutState") || "[]");
      setCartData(updatedCart);

    } catch (err) {
      console.error(err);
    }
  }, [cartData, handleCartAction]);

  // Decrease quantity
  const handleDecreaseQty = useCallback((service) => {
    const existingItem = cartData.find(item => item.service_id === service.id);
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    if (!existingItem) return;

    if (currentQuantity <= 1) {
      handleCartAction({
        serviceId: service.id,
        operation: "remove",
        currentQuantity: 0
      });

      setCartData(prev => prev.filter(item => item.service_id !== service.id));
    } else {
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
  }, [cartData, handleCartAction]);

  // Parse HTML description
  const parseDescription = (htmlString) => {
    if (!htmlString) return [];
    const cleanText = htmlString.replace(/<[^>]*>/g, '').replace(/\t/g, '');
    return cleanText.split('\n').filter(item => item.trim().length > 0);
  };

  // Handle category selection with auto-scroll
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);

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
      ? allServices
      : allServices.filter(service => {
        const category = serviceCategories.find(cat => cat.id === selectedCategory);
        if (!category) return false;

        if (category.apiName === "AMC") {
          return service.service_name.includes("AMC Plan");
        }

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

    const lowerSlug = slug.toLowerCase();
    let matchedCategory = null;

    if (lowerSlug.includes("uninstallation") || lowerSlug.includes("un-installation")) {
      matchedCategory = serviceCategories.find(
        (cat) => cat.apiName.toLowerCase() === "un-installation"
      );
    } else if (lowerSlug.includes("installation") || lowerSlug.includes("install")) {
      matchedCategory = serviceCategories.find(
        (cat) => cat.apiName.toLowerCase() === "installation"
      );
    } else {
      matchedCategory = serviceCategories.find((cat) =>
        lowerSlug.includes(cat.apiName.toLowerCase())
      );
    }

    if (matchedCategory) {
      setSelectedCategory(matchedCategory.id);
    } else {
      setSelectedCategory(0);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    // Fetch brands client-side when needed
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/getBrands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error(err);
      }
    };

    // Only fetch if brands not already loaded
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [slug, brands.length]);

  const normalizedSlug = slug?.replace(/\/$/, "").trim().toLowerCase();

  const matchBrand = brands.find((brand) =>
    brand.page_urls?.some((url) => url.trim().toLowerCase() === normalizedSlug)
  );

  let matchesValidPattern = false;
  if (
    normalizedSlug === "ro-customer-care" ||
    normalizedSlug === "ro-service" ||
    normalizedSlug.includes("-customer-care")
  ) {
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

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
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
          <Link href="/" legacyBehavior>
            <a className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition">
              🏠 Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{pageData?.page_title || "RO Service India - Call 9268887770 Now - Same Day Repair"}</title>
        <meta name="description" content={pageData?.page_description || "RO not working? Don't risk your family's health! Get expert RO service India - doorstep repair in 30 minutes. Trusted by 1000+ homes. Call 9268887770 today!"} />
        <meta name="keywords" content={pageData?.page_keywords} />
        <meta property="og:title" content={pageData?.page_title} />
        <meta property="og:description" content={pageData?.page_description || "RO not working? Don't risk your family's health! Get expert RO service India - doorstep repair in 30 minutes. Trusted by 1000+ homes. Call 9268887770 today!"} />
        <meta property="og:image" content={pageData?.image} />
        <meta property="og:url" content={`https://www.ro-customer-care-service.in//${pageData?.page_url}`} />
        <link
          rel="canonical"
          href={
            pageData?.page_url
              ? `https://www.ro-customer-care-service.in/${pageData.page_url}`
              : `https://www.ro-customer-care-service.in/${slug}`
          }
        />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-0 md:mt-16">
        <div className="max-w-7xl mx-auto p-6">
          {!isCustomerCare ? (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Sidebar - Service Categories */}
              <div className="lg:col-span-3">
                <div className="sticky top-20 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-red-500">{slug !== "ro-service" ? pageData?.page_name : "Water Purifier Service @9266779917"}</p>
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

              {/* Main Content - Hero and Services */}
              <div className="lg:col-span-6">
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
                          <div key={service.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-gray-700 dark:text-gray-800">
                            <div className="flex flex-row gap-4 p-3 rounded-xl border border-gray-200 shadow-sm">
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

              {/* Right Sidebar - Cart and Info */}
              <div className="lg:col-span-3">
                <div className="section-heading bg-white text-gray-800 font-sans p-4 rounded-lg">
                  <strong className="block text-lg md:text-xl mb-2">
                    Best and Qualified RO Water Purifier Services in India.
                  </strong>
                  <p className="text-gray-700">
                    Get connected with the industry&apos;s best. RO Customer Care Service provides a nationwide network of trained and skilled experts.
                  </p>
                </div>

                <div className="sticky top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                              <div key={index} className="border border-gray-200 rounded-lg p-3 text-gray-700 dark:text-gray-800">
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

                          <div className="border-t pt-4 text-gray-700 dark:text-gray-800">
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
          
          <div className="max-w-8xl mx-auto p-4">
            <section className="bg-white rounded-2xl shadow-lg p-5 transition-all duration-300">
              <button
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center w-full text-xl sm:text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors duration-300"
              >
                Service in Popular Cities
                <ChevronDown
                  className={`w-6 h-6 transform transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {popularCities.map((city, idx) => {
                    const slugCity = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const brandSlug = slug
                      ?.split("-")
                      .filter(
                        (part) =>
                          !popularCities
                            .map((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
                            .includes(part)
                      )
                      .join("-");
                    const href = `${brandSlug}-${slugCity}`;

                    return (
                      <Link
                        key={idx}
                        href={href}
                        className="px-4 py-3 border rounded-xl bg-gray-50 hover:bg-blue-50 text-sm sm:text-base font-medium text-gray-700 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        {safeCapitalize(brandSlug)} {city}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <FaqSectionRO />
          <OurBrandSection />
        </div>
      </div>
      <Footer />
      
      <LoginPopup
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onLoginSuccess={onLoginSuccess}
      />

      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 block md:hidden z-50" style={{ marginBottom: "85px" }}>
          <Link href="/checkout">
            <button className="bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center gap-4 px-6 py-3 min-w-[220px]">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>

              <div className="text-center">
                <div className="font-semibold text-sm">View cart</div>
                <div className="text-xs font-medium">
                  {totalItems} ITEM{totalItems !== 1 ? "S" : ""}
                </div>
              </div>

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

// ✅ FIXED: SERVER-SIDE RENDERING with proper error handling
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const pageUrl = Array.isArray(slug) ? slug[0] : slug;
  
  try {
    // ✅ Fetch services
    let services = [];
    try {
      const servicesResponse = await fetch(
        'https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead_type: 1 })
        }
      );

      if (servicesResponse.ok) {
        const data = await servicesResponse.json();
        services = data.service_details?.map((service) => ({
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
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }

    // ✅ FIXED: Fetch page data using absolute URL
    let pageData = null;
    try {
      // Use environment variable or fallback to production URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ro-customer-care-service.in';
      
      const pageResponse = await fetch(
        `${baseUrl}/api/getPage?page_url=${encodeURIComponent(pageUrl)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (pageResponse.ok) {
        pageData = await pageResponse.json();
      }
    } catch (error) {
      console.error("Error fetching page data:", error);
      // Continue without page data - use defaults
    }

    // Return props even if pageData is null (will use defaults in component)
    return {
      props: {
        initialServices: services,
        initialPageData: pageData,
        initialBrands: [], // Client-side only
        slug: pageUrl
      }
    };
  } catch (error) {
    console.error("Critical error in getServerSideProps:", error);
    
    // Return minimal props to prevent 500 error
    return {
      props: {
        initialServices: [],
        initialPageData: null,
        initialBrands: [],
        slug: pageUrl
      }
    };
  }
}