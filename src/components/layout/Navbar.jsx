import { useState, useCallback, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Home,
  Calendar,
  Phone,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import LoginModal from "../ui/login";
import { useAuth } from "@/contexts/userAuth";
import { getCartItems } from "@/utils/cardData";

const Navbar = () => {
  // ✅ consume context
  const { isLoggedIn, userInfo, logout } = useAuth();
  

  const [cartCount, setCartCount] = useState(0);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const mobileUserDropdownRef = useRef(null);

  // ✅ Load cart data and calculate count
  useEffect(() => {
    const loadCartData = () => {
      // Only load cart if user is logged in
      if (!isLoggedIn) {
        setCartCount(0);
        return;
      }
      const cartItems = getCartItems();
      
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        const totalItems = cartItems.reduce(
          (sum, item) => sum + (parseInt(item.quantity) || 0),
          0
        );
        setCartCount(totalItems);
      } else {
        setCartCount(0);
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
    
    // Also listen for custom cart update events
    window.addEventListener("cartUpdated", loadCartData);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", loadCartData);
    };
  }, [isLoggedIn]);

  // ✅ Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (mobileUserDropdownRef.current && !mobileUserDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout using context
// ✅ Logout using context
const handleLogout = useCallback(() => {
  console.log("handleLogout",isLoggedIn);
  
  logout();
  try {
    // 1. Close dropdown
    setUserDropdownOpen(false);
    
    // 2. Clear cart UI immediately
    setCartCount(0);
    
    // 3. Call context logout
    
    // 4. Reload page after small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error("Logout error:", error);
    window.location.reload();
  }
}, [logout]);

  // ✅ Handle navigation
  const handleNavigation = useCallback(
    (tab, action) => {
      setActiveTab(tab);

      // Check if user needs to be logged in for this action
      if (
        (tab === "profile" || tab === "cart" || tab === "bookings") &&
        !isLoggedIn
      ) {
        setOpenLoginModal(true);
        return;
      }

      if (action === "cart") {
        // Check if cart has items before redirecting
        const cartItems = getCartItems();
        if (!cartItems || cartItems.length === 0) {
          // Optional: Show a message that cart is empty
          alert("Your cart is empty!");
          return;
        }
        // Redirect to checkout page
        window.location.href = "/checkout";
      } else if (action === "profile") {
        window.location.href = "/profile";
      } else if (action === "bookings") {
        window.location.href = "/bookings";
      } else if (action === "home") {
        window.location.href = "/";
      }
    },
    [isLoggedIn]
  );

  // ✅ Handle phone call
  const handleCall = () => {
    window.location.href = "tel:+917065012902";
  };

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
            <a href="/">
              <span className="font-bold text-xl text-gray-900">
                RO Service Care
              </span>
            </a>
          </div>

          

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart */}
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

            {/* User Profile - Desktop Only */}
            <div className="hidden md:block relative" ref={userDropdownRef}>
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
                    <span className="font-medium text-sm hidden lg:block">
                      {userInfo.name}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* User Dropdown */}
              {isLoggedIn && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {userInfo?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {userInfo?.phone}
                    </p>
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

            {/* Mobile User Icon - With dropdown */}
            <div className="md:hidden relative" ref={mobileUserDropdownRef}>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setUserDropdownOpen(!userDropdownOpen);
                  } else {
                    setOpenLoginModal(true);
                  }
                }}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
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
              </button>

              {/* Mobile User Dropdown */}
              {isLoggedIn && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {userInfo?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {userInfo?.phone}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleNavigation("profile", "profile");
                        setUserDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Details
                    </button>

                    <button
                      onClick={() => {
                        handleNavigation("bookings", "bookings");
                        setUserDropdownOpen(false);
                      }}
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
      <LoginModal open={openLoginModal} onClose={() => setOpenLoginModal(false)} />

      {/* Add padding for mobile bottom nav */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;