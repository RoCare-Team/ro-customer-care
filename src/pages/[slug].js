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

  console.log("isLoggedIn",isLoggedIn);
  

  // Ref for auto-scroll
  const servicesRef = useRef(null);

  // City data
  const cities = [
    'Delhi', 'Mumbai', 'Agra', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
    'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
    'Pimpri-Chinchwad', 'Patna'
  ];

  // Load cart data from localStorage
  const loadCartFromStorage = useCallback(() => {
    try {
      const storedCart = localStorage.getItem("checkoutState");
      if (storedCart) {
        const cartDetails = JSON.parse(storedCart);
        
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
        console.log("Cart loaded from storage:", cartItems);
      } else {
        setCartData([]);
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      setCartData([]);
    }
  }, []);

  // City validation effect
  useEffect(() => {
    if (!slug) return;

    if (slug === "ro-service") {
      setCity("");
      setInvalid(false);
      return;
    }

    const cityFromSlug = slug.replace("ro-service-", "").toLowerCase();
    const matchedCity = cities.find(c => c.toLowerCase() === cityFromSlug);

    if (matchedCity) {
      setCity(matchedCity);
      setInvalid(false);
    } else {
      setCity("");
      setInvalid(true);
    }
  }, [slug]);

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
          : operation === "decrement" ? Math.max(0, currentQuantity - 1) : 0,
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
  const handleAddToCart = useCallback((service) => {
    const existingItem = cartData.find(item => 
      item.service_id === service.id || item.service_id === service.service_id
    );
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    handleCartAction({
      serviceId: service.id,
      operation: "add",
      currentQuantity
    });
  }, [cartData, handleCartAction]);

  // Increase quantity handler
  const handleIncreaseQty = useCallback((service) => {
    const existingItem = cartData.find(item => 
      item.service_id === service.id || item.service_id === service.service_id
    );
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    handleCartAction({
      serviceId: service.id,
      operation: "add",
      currentQuantity
    });
  }, [cartData, handleCartAction]);

  // Decrease quantity handler
// Decrease quantity handler
console.log("cartData",cartData);

  const handleDecreaseQty = useCallback((service) => {
    const existingItem = cartData.find(item => 
      item.service_id === service.id || item.service_id === service.service_id
    );
    const currentQuantity = existingItem ? parseInt(existingItem.quantity) : 0;

    if (currentQuantity <= 1) {
      // Remove item if current quantity is 1 or less
      handleCartAction({
        serviceId: service.id,
        operation: "remove",
        currentQuantity: 0
      });
    } else {
      // Decrease quantity by 1
      handleCartAction({
        serviceId: service.id,
        operation: "decrement",
        currentQuantity: currentQuantity
      });
    }
  }, [cartData, handleCartAction]);
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

  if (invalid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-white px-6">
        <div className="bg-red-100 p-4 rounded-full mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-600"
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
        <h1 className="text-3xl font-bold text-gray-800">404 - City Not Found</h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md text-center">
          Oops! The city you are looking for doesn't exist in our service area.
          Please check the link or go back.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          ⬅ Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 mt-0 md:mt-16">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Service Categories - STICKY */}
            <div className="lg:col-span-2">
              <div className="sticky top-20 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-500">Water Purifier Service {city}</p>
                    <p className="text-xs text-gray-600">@7065012902</p>
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
            <div className="lg:col-span-7">
              {/* Hero Section */}
              <Image
                src={RoServiceCare}
                alt="RO Service Care"
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
                                  <img
                                    src={service.image}
                                    alt={service.service_name}
                                    className="w-full h-full object-cover"
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

                              {!inCart ? (
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
                                    {quantity}
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
              <div className="sticky top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
                {/* Cart Section */}
                <div className="bg-white rounded-lg shadow-sm">
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

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                          </div>
                          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                            Proceed to Checkout ({totalItems} items)
                          </button>
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
          <AwardCertifications/>
          <ROServiceContent city={city}/>
          <BlueNearbyAreas/>
        </div>
      </div>
      <Footer/>
      <LoginPopup
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onLoginSuccess={onLoginSuccess}
      />
    </>
  );
}