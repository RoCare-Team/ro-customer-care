import { useState, useCallback, useEffect, useRef } from "react";
import { ShoppingCart, User, Home, Calendar, Phone, ChevronDown, LogOut, Package, Settings } from "lucide-react";
import LoginModal from "../ui/login";

// Mock LoginModal component (replace with your actual import)


const Navbar = () => {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);

  // Check login status on mount
  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
    const userName = localStorage.getItem("userName");
    const userPhone = localStorage.getItem("userPhone");
    
    if (customerId) {
      setIsLoggedIn(true);
      setUserInfo({
        id: customerId,
        name: userName || "User",
        phone: userPhone || "",
      });
    }
  }, []);

  // Load cart data
  useEffect(() => {
    const loadCartData = () => {
      const checkoutState = localStorage.getItem("checkoutState");
      if (checkoutState) {
        try {
          const cartData = JSON.parse(checkoutState);
          if (Array.isArray(cartData)) {
            setCartItems(cartData);
            const totalItems = cartData.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
            setCartCount(totalItems);
          }
        } catch (error) {
          console.error("Error parsing cart data:", error);
          setCartCount(0);
          setCartItems([]);
        }
      }
    };

    loadCartData();

    // Listen for storage changes (cart updates)
    const handleStorageChange = (e) => {
      if (e.key === "checkoutState") {
        loadCartData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(e.target)) {
        setCartDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle login success
  const handleLoginSuccess = useCallback((userData) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    setOpenLoginModal(false);
    
    // Store in localStorage
    localStorage.setItem("customer_id", userData.id);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userPhone", userData.phone);
    
    console.log("Login successful:", userData);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setUserDropdownOpen(false);
    setCartCount(0);
    setCartItems([]);
    window.location.reload();

    
    // Clear localStorage
    const keysToRemove = [
      "customer_id", "userName", "userPhone", "userEmail", 
      "userToken", "checkoutState", "cart_total_price", "RecentAddress"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log("Logout successful");
  }, []);

  // Handle navigation
  const handleNavigation = useCallback((tab, action) => {
    setActiveTab(tab);
    
    // If trying to access protected routes without login
    if ((tab === "profile" || tab === "cart" || tab === "bookings") && !isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    
    // Handle different actions
    if (action === "cart") {
      setCartDropdownOpen(!cartDropdownOpen);
    } else if (action === "profile") {
      console.log("Navigate to profile");
    } else if (action === "bookings") {
      console.log("Navigate to bookings");
    } else if (action === "home") {
      console.log("Navigate to home");
    }
  }, [isLoggedIn, cartDropdownOpen]);

  // Handle phone call
  const handleCall = () => {
    window.location.href = "tel:+917065012902";
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + ((parseInt(item.price) || 0) * (parseInt(item.quantity) || 0));
  }, 0);




  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-0 w-full z-40 shadow-md bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <a href="/"><span className="font-bold text-xl text-gray-900">RO Service Care</span></a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <div className="relative" ref={cartDropdownRef}>
              <button
                onClick={() => handleNavigation("cart", "cart")}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {cartDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {cartItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.service_name || "Service"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{(parseInt(item.price) || 0) * (parseInt(item.quantity) || 0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-blue-600">₹{totalPrice}</span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setUserDropdownOpen(!userDropdownOpen);
                  } else {
                    setOpenLoginModal(true);
                  }
                }}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {isLoggedIn && userInfo?.name ? (
                    <span className="font-semibold text-sm">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                {isLoggedIn && userInfo?.name && (
                  <>
                    <span className="font-medium text-sm hidden lg:block">{userInfo.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* User Dropdown */}
              {isLoggedIn && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">{userInfo?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{userInfo?.phone}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigation("profile", "profile")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Details
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("bookings", "bookings")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Calendar className="w-4 h-4 mr-3" />
                      My Bookings
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button
            onClick={() => handleNavigation("home", "home")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "home" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Home</span>
          </button>

          {/* Bookings */}
          <button
            onClick={() => handleNavigation("bookings", "bookings")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "bookings" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Bookings</span>
          </button>

          {/* Cart */}
         
          {/* Profile */}
          <button
            onClick={() => handleNavigation("profile", "profile")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "profile" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Profile</span>
          </button>

          {/* Call */}
          <button
            onClick={handleCall}
            className={`flex flex-col items-center p-2 ${
              activeTab === "call" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Call</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Add padding for mobile bottom nav */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;