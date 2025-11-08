"use client"
import React, { useState, useEffect, useCallback } from 'react';
import {
  Wrench,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Shield,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Zap,
  Heart,
  Home,
  Briefcase,
  Trash2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import LoginModal from './login';
import { getCartItems } from '@/utils/cardData';
import { useAuth } from '@/contexts/userAuth';
import Image from 'next/image';
import Head from 'next/head';



// Mock Auth Context (replace with your actual context)
// const useAuth = () => {

//   // const [isLoggedIn, setIsLoggedIn] = React.useState(false);

//   React.useEffect(() => {
//     // Only access localStorage on client side
//     if (typeof window !== 'undefined') {
//       setIsLoggedIn(!!localStorage.getItem('customer_id'));
//     }
//   }, []);

//   return {
//     isLoggedIn,
//     handleLoginSuccess: () => { }
//   };
// };

// Mock Login Modal (replace with your actual component)


const ServiceCardSkeleton = () => (
  <div className="group relative flex flex-col justify-between p-3 sm:p-4 h-56 sm:h-64 rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded mx-auto w-1/2"></div>
    </div>
    <div className="mt-2 h-8 sm:h-10 bg-gray-200 rounded-lg"></div>
  </div>
);


const CartButton = ({ onClick, loading, children, className }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`w-6 h-6 md:w-7 md:h-7 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? (
      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    ) : (
      children
    )}
  </button>
);

const getAddressIcon = (type) => {
  switch (type) {
    case "home":
      return Home;
    case "work":
      return Briefcase;
    default:
      return MapPin;
  }
};


const ROServices = ({ onAddressSubmit, handleClose }) => {
  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [selectedApiServices, setSelectedApiServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(0)
  const [addressLoading, setAddressLoading] = useState(true);



  const [formData, setFormData] = useState({
    street: '',
    landmark: '',
    houseNo: '',
    pincode: '',
    state: '',
    city: '',
    full_address: '',
    phone: '',
    alt_address_mob: '',
    phoneNumber: '',
    home_office: 'home',
    name: '',
  });



  // Data states
  const [mainServices, setMainServices] = useState([]);
  const [modalServices, setModalServices] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [recentAddress, setRecentAddress] = useState([]);
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [cartOperationLoading, setCartOperationLoading] = useState({});

  // Loading states
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isTimeSlotsLoading, setIsTimeSlotsLoading] = useState(false);
  const { isLoggedIn, handleLoginSuccess } = useAuth();
  const [cartLoaded, setCartLoaded] = useState(false);


  // 🔹 Function to handle address selection
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  console.log("selectedAddress", selectedAddress);





  // Animation states
  const [modalAnimation, setModalAnimation] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);


  const cartItems = getCartItems();

  console.log("cartItems", cartItems);

  // const findAdressId2 = findAdressId();






  // Default time slots fallback
  const defaultTimeSlots = [
    { id: 1, label: "09:00 AM", name: "Morning" },
    { id: 2, label: "10:00 AM", name: "Morning" },
    { id: 3, label: "11:00 AM", name: "Late Morning" },
    { id: 4, label: "12:00 PM", name: "Noon" },
    { id: 5, label: "02:00 PM", name: "Afternoon" },
    { id: 6, label: "03:00 PM", name: "Afternoon" },
    { id: 7, label: "04:00 PM", name: "Evening" },
    { id: 8, label: "05:00 PM", name: "Evening" },
    { id: 9, label: "06:00 PM", name: "Evening" }
  ];

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Fetch main services for the grid
  const fetchMainServices = useCallback(async () => {
    try {
      setIsMainLoading(true);
      const response = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_type: "1" }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch services');

      const data = await response.json();

      const formattedServices = data?.service_details?.map((service) => ({
        id: service.id,
        service_id: service.id,
        service_name: service.service_name,
        description: service.description,
        price: parseInt(service.price) || 0,
        image_icon: service.image || "/api/placeholder/48/48",
        status: service.status || "1",
        title: service.service_name,
        desc: service.description?.replace(/<[^>]*>/g, '').substring(0, 100) + "..." || "Professional service",
        buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-500'
      })) || [];

      setMainServices(formattedServices);

    } catch (error) {
      console.error("Error fetching main services:", error);
      toast.error("Failed to load services");
      setMainServices([]);
    } finally {
      setIsMainLoading(false);
    }
  }, []);

  console.log("selectedApiServices", selectedApiServices);


  // Fetch services for modal
  const fetchModalServices = useCallback(async (leadType = 1) => {
    try {
      setIsModalLoading(true);
      const response = await fetch(
        'https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead_type: leadType })
        }
      );

      if (!response.ok) throw new Error('Failed to fetch modal services');

      const data = await response.json();

      // Get existing cart from localStorage
      // Convert cartItems array to a Map for quick lookup
      const cartMap = new Map(
        cartItems?.map(item => [String(item.service_id), parseInt(item.quantity)]) || []
      );

      const formattedServices = data.service_details?.map((service) => {
        const cartQuantity = cartMap.get(String(service.id)) || 0;

        return {
          id: service.id,
          service_id: service.id,
          service_name: service.service_name,
          description: service.description,
          price: parseInt(service.price) || 0,
          price_without_discount: parseInt(service.price_without_discount) || parseInt(service.price) || 0,
          image: service.image || "/api/placeholder/48/48",
          status: service.status || "1",
          quantity: cartQuantity, // ✅ cartItems ki quantity yaha merge hogi
        };
      }) || [];

      console.log("formattedServices", formattedServices);


      // Modal me show karne ke liye set karo
      setModalServices(formattedServices);

      // ✅ Sirf wahi services select karo jinki quantity cart me > 0 hai
      const servicesInCart = formattedServices.filter(s => s.quantity > 0);
      console.log("servicesInCart", servicesInCart);

      setSelectedApiServices(servicesInCart);

      // console.log("1666",servicesInCart);

    } catch (error) {
      console.error('Error fetching modal services:', error);
      toast.error("Failed to load services");
      setModalServices([]);
      setCategoryTitle('Services');
    } finally {
      setIsModalLoading(false);
    }
  }, []);

  // Fetch time slots for selected date
  const fetchTimeSlots = useCallback(async (date) => {
    if (!date) {
      setTimeSlots(defaultTimeSlots);
      return;
    }

    try {
      setIsTimeSlotsLoading(true);
      const response = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/time_slot.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch time slots');

      const data = await response.json();

      console.log("datadata", data);


      let slots = [];

      if (Array.isArray(data.all_time_slots)) {
        slots = data.all_time_slots.map((slot) => ({
          id: slot.id,
          label: slot.time_slots,
          name: slot.slot_name
        }));
      } else if (Array.isArray(data.slots)) {
        slots = data.slots;
      } else {
        slots = defaultTimeSlots;
      }

      setTimeSlots(slots);

    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error("Failed to load time slots");
      setTimeSlots(defaultTimeSlots);
    } finally {
      setIsTimeSlotsLoading(false);
    }
  }, []);

  const loadRecentAddresses = () => {
    setAddressLoading(true); // start loader

    try {
      const stored = localStorage.getItem('RecentAddress');
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentAddress(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Error loading recent addresses:', error);
      setRecentAddress([]);
    } finally {
      setAddressLoading(false); // stop loader
    }
  };

  const handleCartAction = useCallback(
    async ({ serviceId, operation, type }) => {
      console.log("type", type);

      if (!isLoggedIn || !localStorage.getItem("customer_id")) {
        setOpenLoginModal(true);
        setPendingCartAction({ serviceId, operation });
        toast.error("Please login to continue");
        return;
      }

      const customerId = localStorage.getItem("customer_id");
      setCartOperationLoading(prev => ({ ...prev, [serviceId]: true }));

      try {
        // Get current quantity directly from modalServices to avoid stale value
        const serviceItem = modalServices?.find(s => s.id === serviceId);
        if (!serviceItem) throw new Error("Service not found");
        let newQuantity = serviceItem.quantity || 0;

        switch (operation) {
          case "add":
            newQuantity += 1;
            break;
          case "delete":
            newQuantity -= 1;
            break;
          case "remove":
            newQuantity = 0;
            break;
        }

        // then you do
        setQuantity(newQuantity);
        console.log("quantity", quantity);



        const payload = {
          service_id: serviceId,
          type: operation === "remove" ? "delete" : operation,
          cid: customerId,
          quantity: newQuantity,
          source: "RoServiceCare Testing",
        };

        const res = await fetch(
          "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error(`Cart API failed: ${res.status}`);
        const data = await res.json();
        localStorage.setItem("checkoutState", data)

        if (data.AllCartDetails) {

          localStorage.setItem("checkoutState", JSON.stringify(data.AllCartDetails));
          localStorage.setItem("cart_total_price", data.total_price || data.total_main || 0);

          setSelectedApiServices(prev => {
            // Remove item if quantity is 0
            if (newQuantity === 0) {
              toast.success("Service removed from cart");
              return prev.filter(s => s.id !== serviceId);
            }

            // Update quantity if item exists
            const existingIndex = prev.findIndex(s => s.id === serviceId);
            if (existingIndex !== -1) {
              toast.success("Cart updated");
              return prev.map(s =>
                s.id === serviceId ? { ...s, quantity: newQuantity } : s
              );
            }

            // Add new item if not exists
            const service = modalServices.find(s => s.id === serviceId);
            if (service) {
              toast.success("Service added to cart");
              return [...prev, { ...service, quantity: newQuantity }];
            }

            return prev;
          });

          // Update modalServices state the same way
          setModalServices(prev => {
            if (newQuantity === 0) {
              return prev.map(s => (s.id === serviceId ? { ...s, quantity: 0 } : s));
            }
            return prev.map(s => (s.id === serviceId ? { ...s, quantity: newQuantity } : s));
          });
          setCartLoaded(prev => !prev);
        }
      } catch (error) {
        console.error("Cart update failed:", error);
        toast.error("Failed to update cart. Please try again.");
      } finally {
        setCartOperationLoading(prev => ({ ...prev, [serviceId]: false }));
      }
    },
    [isLoggedIn, modalServices]
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = localStorage.getItem("customer_id");
    if (!customerId) {
      toast.error("Please login first");
      setOpenLoginModal(true);
      return;
    }

    const submitToast = toast.loading("Saving address...");

    try {
      const payload = {
        ...formData,
        cid: customerId
      };

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_address.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.status === "success" || data.msg?.toLowerCase().includes("success")) {
        const addressObj = {
          id: data.address_id || Date.now().toString(),
          flat_no: formData.houseNo,
          landmark: formData.landmark,
          area: formData.street,
          state: formData.state,
          city: formData.city,
          pincode: formData.pincode,
          type: formData.home_office || 'home',
          address: `${formData.houseNo}, ${formData.street}, ${formData.city}`
        };

        const existing = JSON.parse(localStorage.getItem("RecentAddress") || "[]");
        const isDuplicate = existing.some(
          (addr) =>
            addr.flat_no === addressObj.flat_no &&
            addr.landmark === addressObj.landmark &&
            addr.area === addressObj.area &&
            addr.city === addressObj.city
        );

        const updated = isDuplicate ? existing : [addressObj, ...existing].slice(0, 10);
        localStorage.setItem("RecentAddress", JSON.stringify(updated));

        loadRecentAddresses();
        setSelectedAddress(addressObj);
        setShowAddressForm(false);

        setFormData({
          street: '', landmark: '', houseNo: '', pincode: '', state: '', city: '',
          full_address: '', phone: '', alt_address_mob: '', phoneNumber: '',
          home_office: 'home', name: '',
        });

        toast.success(data.msg || "Address saved successfully!", { id: submitToast });
      } else {
        toast.error(data.msg || "Failed to save address", { id: submitToast });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.", { id: submitToast });
    }
  };





  // 🔹 Function to handle address selection
  // const handleSelectAddress = (address) => {
  //   setSelectedAddress(address);
  // };

  const handlePaymentCompleted = async (leadtype, redirect = true) => {
    const cust_id = localStorage.getItem("customer_id");
    const cust_mobile = localStorage.getItem("userPhone");
    const address_id = selectedAddress?.id || "";
    // const cust_email = localStorage.getItem("email" || "userEmail");
    const cust_email = localStorage.getItem("email") || localStorage.getItem("userEmail");

    const chkout = JSON.parse(localStorage.getItem("checkoutState") || "[]");
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const cart_id = chkout[0]?.category_cart_id;

    const timeSlotData = localStorage.getItem("bookingTimeSlot");
    const time = timeSlotData ? JSON.parse(timeSlotData) : {};
    const appointment_time = selectedTime;
    const appointment_date = selectedDate;

    const source = 'Testing RoServiceCare';

    console.log("chkout[0].category_cart_id", chkout[0]);


    // console.log(cust_id,cust_mobile,address_id,cust_email,appointment_date,appointment_time);


    // Validate all required fields
    if (!cust_id || !cust_mobile || !address_id || !cust_email || !appointment_date || !appointment_time) {
      toast.error("Please complete all booking details before proceeding to payment", {
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      cust_id,
      cust_mobile,
      address_id,
      cust_email,
      cart_id,
      appointment_time,
      appointment_date,
      source
    };

    try {
      const res = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/add_lead_with_full_dtls.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error == false) {
        // toast.success(data.msg);

        const leftOverItems = chkout.filter(items => items.category_cart_id !== cart_id);

        if (leftOverItems.length > 0) {
          localStorage.setItem('checkoutState', JSON.stringify(leftOverItems));
        } else {
          localStorage.setItem('checkoutState', JSON.stringify([]));
        }

        const currentCategoryItem = chkout.find(item => item.category_cart_id === cart_id);

        if (currentCategoryItem && cartItems.length > 0) {
          const checkedOutServiceIds = currentCategoryItem.cart_dtls.map(service => String(service.service_id));

          const remainingItems = cartItems.filter(item => {
            const isIncluded = checkedOutServiceIds.includes(String(item));
            return !isIncluded;
          });

          localStorage.setItem('cartItems', JSON.stringify(remainingItems));
          window.dispatchEvent(new Event('cartItemsUpdated'));
        } else if (leftOverItems.length === 0) {
          localStorage.setItem('cartItems', JSON.stringify([]));
        }

        // Clear booking data
        const itemsToRemove = [
          "bookingTimeSlot",
          "bookingAddress",
          "time_slot",
          "address_id",
        ];

        itemsToRemove.forEach(item => {
          localStorage.removeItem(item);
        });

        // Reset booking state



        // console.log(JSON.stringify(data) + "the data of the all leads generated");
        if (redirect) {
          setTimeout(() => {
            window.location.href = data.lead_id_for_payment;
          }, 100);
        } else {
          // toast.success("", { autoClose: 3000 });
          // cons.log("Thank You!.....");
          toast.success("Thank You!....");
        }
        // setTimeout(() => {
        //     window.location.href = data.lead_id_for_payment;
        // }, 100);
      } else {
        toast.error(data.msg || "Payment processing failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Payment error:", error);
    }
  };

  // Initialize main services
  useEffect(() => {
    fetchMainServices();
  }, [fetchMainServices]);

  useEffect(() => {
    loadRecentAddresses();
  }, []);



  // Handle pending cart action after login
  useEffect(() => {
    if (isLoggedIn && pendingCartAction) {
      handleCartAction(pendingCartAction);
      setPendingCartAction(null);
    }
  }, [isLoggedIn, pendingCartAction, handleCartAction]);

  // Handle modal animations
  useEffect(() => {
    if (isModalOpen) {
      setModalAnimation('modal-enter');
      setTimeout(() => setModalAnimation('modal-enter-active'), 10);
    } else {
      setModalAnimation('modal-exit');
    }
  }, [isModalOpen]);

  // Handle date change
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, fetchTimeSlots]);

  // Modal management functions
  const openModal = useCallback((service) => {
    setSelectedService(service);
    setSelectedApiServices([]);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedAddress(recentAddress[0] || null);
    setCurrentStep(1);
    setShowAddressForm(false);
    setCategoryTitle('');
    setModalServices([]);
    setTimeSlots(defaultTimeSlots);
    setIsModalOpen(true);
    fetchModalServices(1);
  }, [recentAddress, fetchModalServices]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
      setSelectedApiServices([]);
      setCurrentStep(1);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedAddress(null);
      setShowAddressForm(false);
      setModalServices([]);
      setCategoryTitle('');
      setTimeSlots(defaultTimeSlots);
      setModalAnimation('');
      setFormData({
        street: '', landmark: '', houseNo: '', pincode: '', state: '', city: '',
        full_address: '', phone: '', alt_address_mob: '', phoneNumber: '',
        home_office: 'home', name: '',
      });
    }, 300);
  }, []);

  // Navigation functions
  const handleProceedToDetails = useCallback(() => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      toast.error("Please login to continue");
      return;
    }

    if (selectedApiServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    toast.success("Proceeding to booking details");
    setCurrentStep(2);
  }, [isLoggedIn, selectedApiServices.length]);

  const handleBackToServices = useCallback(() => {
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots(defaultTimeSlots);
  }, []);



  // Utility functions
  const getTotalPrice = useCallback(() => {
    return selectedApiServices.reduce((total, service) =>
      total + (service.price * service.quantity), 0
    );
  }, [selectedApiServices]);

  const getTotalOriginalPrice = useCallback(() => {
    return selectedApiServices.reduce((total, service) =>
      total + (service.price_without_discount * service.quantity), 0
    );
  }, [selectedApiServices]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getServiceBg = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('repair')) return 'bg-red-50';
    if (name.includes('installation')) return 'bg-green-50';
    if (name.includes('amc') || name.includes('plan')) return 'bg-purple-50';
    if (name.includes('service')) return 'bg-blue-50';
    return 'bg-gray-50';
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return MapPin;
    }
  };



  // Render loading state for main services
  if (isMainLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md max-w-7xl mx-auto my-6 sm:my-10">
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 animate-pulse"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-16 sm:w-24 animate-pulse"></div>
        </div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96 mb-4 sm:mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array(12).fill(0).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }


  console.log("selectedApiServices", selectedApiServices);


  return (
    <>
     <Head>
            <title>{"RO Customer Care & Service in India"}</title>
            <meta name="description" content={"Expert RO service and customer care for Kent, Pureit, Livpure, Hindware, Haier & more. Book trusted water purifier repair in Delhi, Mumbai, Gurgaon & cities."} />
            <meta property="og:description" content={"Expert RO service and customer care for Kent, Pureit, Livpure, Hindware, Haier & more. Book trusted water purifier repair in Delhi, Mumbai, Gurgaon & cities."} />
            <meta property="og:url" content={`https://www.ro-customer-care-service.in`} />
              <link rel="canonical" href="https://www.ro-customer-care-service.in/" />

          </Head>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />


      <section className="py-6 md:py-16 px-3 md:px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">


        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              <span className="text-blue-600">RO</span> Services
            </p>
            <a
              href="/ro-services"
              className="text-blue-600 text-xs sm:text-sm font-medium hover:underline transition-colors"
            >
              View all →
            </a>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
            Choose from our comprehensive range of RO services. Click any service to book directly.
          </p>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainServices?.map((service) => {
              const { id, title, price, description, image_icon } = service;
              const isExpanded = expandedCard === id;
              const isTruncated = description.length > 120;
              const displayDescription = isExpanded ? description : (isTruncated ? `${description.slice(0, 120)}...` : description);

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col p-4 border"
                >
                  <div className="w-full flex justify-center items-center mb-3">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Image
                        src={image_icon}
                        alt={title}
                        width={150}
                        height={160}
                        className="w-16 md:w-20 h-16 md:h-20 object-contain"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/48/48";
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
                    {title}
                  </h3>

                  <span className="text-blue-600 font-bold text-xl text-center mb-2">
                    ₹{price}
                  </span>

                  <div
                    className="text-gray-600 text-sm text-left leading-snug flex-grow [&>ul]:list-none [&>ul]:space-y-1 [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:before:content-['✔'] [&>ul>li]:before:text-blue-600 [&>ul>li]:before:mr-2"
                    dangerouslySetInnerHTML={{
                      __html: displayDescription,
                    }}
                  />

                  {isTruncated && (
                    <button
                      onClick={() => toggleExpand(id)}
                      className="text-blue-600 text-xs font-medium underline mt-2 hover:text-blue-800 transition text-left"
                    >
                      {isExpanded ? "View Less" : "View More Details"}
                    </button>
                  )}

                  <button
                    onClick={() => openModal(service)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition w-full"
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedService && (
        <div className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-md transition-all duration-300 ${modalAnimation}`}>
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full mx-2 md:mx-4 transform transition-all duration-500 max-h-[90vh] md:max-h-[95vh] overflow-y-auto modal-content">

            {/* Modal Header */}
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${currentStep >= 1
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-200 text-gray-500'
                      }`}>
                      {currentStep > 1 ? <CheckCircle className="w-4 md:w-5 h-4 md:h-5" /> : '1'}
                      {currentStep === 1 && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
                      )}
                    </div>
                    <span className={`text-xs md:text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                      Service
                    </span>
                  </div>

                  <div className="relative w-8 md:w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ${currentStep >= 2 ? 'w-full' : 'w-0'
                      }`}></div>
                  </div>

                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${currentStep >= 2
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-200 text-gray-500'
                      }`}>
                      2
                      {currentStep === 2 && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
                      )}
                    </div>
                    <span className={`text-xs md:text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                      Details
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 rounded-full p-2 md:p-2.5 group hover:rotate-90"
                >
                  <X className="w-4 md:w-5 h-4 md:h-5 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-8">
              {currentStep === 1 ? (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center">
                    <div className="mt-2 inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      Choose Service you Need
                    </div>
                  </div>

                  {isModalLoading ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="relative">
                        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium text-sm md:text-base">Loading services...</p>
                    </div>
                  ) : modalServices.length > 0 ? (
                    <>
                      {/* Selected Services */}
                      {selectedApiServices.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-3">Selected Services</h5>
                          <div className="space-y-2">
                            {selectedApiServices
                              .filter(service => Number(service.quantity) > 0) // <-- ensure it's a number
                              .map((selectedServiceItem) => (
                                <div
                                  key={selectedServiceItem.id}
                                  className="group relative p-2 md:p-4 border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl transition-all duration-300 shadow-sm"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 md:space-x-3 flex-1">
                                      <div className={`${getServiceBg(selectedServiceItem.service_name)} w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                                        <img
                                          src={selectedServiceItem.image}
                                          alt={selectedServiceItem.service_name}
                                          className='w-10 h-10 md:w-10 md:h-10 rounded-lg'
                                          onError={(e) => { e.target.src = "/api/placeholder/40/40"; }}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-bold text-gray-900 text-sm md:text-lg mb-1">
                                          {selectedServiceItem.service_name}
                                        </h5>
                                        <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                                          <div className="flex items-center space-x-1">
                                            <span className="font-bold text-gray-900">₹{selectedServiceItem.price}</span>
                                            {selectedServiceItem.price_without_discount > selectedServiceItem.price && (
                                              <span className="text-gray-500 line-through">₹{selectedServiceItem.price_without_discount}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2 md:space-x-3">
                                      <div className="flex items-center space-x-1 md:space-x-2 bg-white rounded-lg px-2 py-1">
                                        <CartButton
                                          onClick={e => {
                                            e.stopPropagation();
                                            if (selectedServiceItem.quantity > 0) {
                                              handleCartAction({
                                                serviceId: selectedServiceItem.id,
                                                operation: "delete",
                                                type: 1
                                              });
                                            }
                                          }}
                                          loading={cartOperationLoading[selectedServiceItem.id]}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          <Minus className="w-3 md:w-4 h-3 md:h-4" />
                                        </CartButton>

                                        <span className="w-6 md:w-8 text-center font-bold text-sm md:text-base">
                                          {selectedServiceItem.quantity}
                                        </span>

                                        <CartButton
                                          onClick={e => {
                                            e.stopPropagation();
                                            handleCartAction({
                                              serviceId: selectedServiceItem.id,
                                              operation: "add",
                                              currentQuantity: selectedServiceItem.quantity,
                                              type: "2"
                                            });
                                          }}
                                          loading={cartOperationLoading[selectedServiceItem.id]}
                                          className="bg-green-500 hover:bg-green-600"
                                        >
                                          <Plus className="w-3 md:w-4 h-3 md:h-4" />
                                        </CartButton>
                                      </div>

                                      <CartButton
                                        onClick={() =>
                                          handleCartAction({ serviceId: selectedServiceItem.id, operation: "remove" })
                                        }
                                        loading={cartOperationLoading[selectedServiceItem.id]}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        <X className="w-3 md:w-4 h-3 md:h-4" />
                                      </CartButton>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}



                      {/* Available Services */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-3">
                          {selectedApiServices.length > 0 ? 'Add More Services' : 'Available Services'}
                        </h5>

                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                          {modalServices
                            .filter(apiService => !selectedApiServices.some(s => s.id === apiService.id))
                            .map((apiService) => (
                              <div
                                key={apiService.id}
                                onClick={() => {
                                  handleCartAction({
                                    serviceId: apiService.id,
                                    operation: "add",
                                    currentQuantity: apiService.quantity
                                  });
                                }}
                                className="group relative p-3 md:p-4 border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 w-full"
                              >
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className={`${getServiceBg(apiService.service_name)} w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                                    <img
                                      src={apiService.image}
                                      alt={apiService.service_name}
                                      className='w-10 h-10 md:w-10 md:h-10 rounded-lg'
                                      onError={(e) => {
                                        e.target.src = "/api/placeholder/40/40";
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-900 text-sm md:text-base mb-1">
                                      {apiService.service_name}
                                    </h5>
                                    <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                                      <div className="flex items-center space-x-1">
                                        <span className="font-bold text-gray-900">₹{apiService.price}</span>
                                        {apiService.price_without_discount > apiService.price && (
                                          <span className="text-gray-500 line-through">₹{apiService.price_without_discount}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                                    {cartOperationLoading[apiService.id] ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <Plus className="w-4 md:w-5 h-4 md:h-5" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {modalServices.filter(apiService => !selectedApiServices.some(s => s.id === apiService.id)).length === 0 && selectedApiServices.length > 0 && (
                          <div className="text-center py-4 bg-gray-50 rounded-xl">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">All available services have been selected</p>
                          </div>
                        )}
                      </div>

                      {/* Selected Services Summary */}
                      {selectedApiServices.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200">
                          <div className="flex items-center justify-between mb-3 md:mb-4">
                            <h5 className="font-bold text-gray-900 text-sm md:text-base">Selected Services Summary</h5>
                            <span className="text-xs md:text-sm text-gray-600">{selectedApiServices.length} item{selectedApiServices.length > 1 ? 's' : ''}</span>
                          </div>
                          <div className="space-y-2 mb-3 md:mb-4 max-h-32 md:max-h-40 overflow-y-auto">
                            {selectedApiServices.map((service) => (
                              <div key={service.id} className="flex items-center justify-between bg-white rounded-lg p-2 md:p-3">
                                <div className="flex-1">
                                  <span className="text-xs md:text-sm font-medium text-gray-900">{service.service_name}</span>
                                  <span className="text-xs text-gray-600 ml-2">x{service.quantity}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs md:text-sm font-bold">₹{service.price * service.quantity}</span>
                                  <button
                                    onClick={() => handleCartAction({ serviceId: service.id, operation: "remove" })}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="w-3 md:w-4 h-3 md:h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-blue-200 pt-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-xs md:text-sm text-gray-600">Total Amount</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg md:text-xl font-bold text-gray-900">₹{getTotalPrice()}</span>
                                  {getTotalOriginalPrice() > getTotalPrice() && (
                                    <span className="text-xs md:text-sm text-gray-500 line-through">₹{getTotalOriginalPrice()}</span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={handleProceedToDetails}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center space-x-2 text-sm md:text-base"
                              >
                                <span>Continue</span>
                                <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wrench className="w-6 md:w-8 h-6 md:h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4 text-sm md:text-base">No services available</p>
                      <button
                        onClick={() => fetchModalServices(1)}
                        className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  <button
                    onClick={handleBackToServices}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 text-sm md:text-base"
                  >
                    <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
                    <span>Back to services</span>
                  </button>

                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">Selected Services</h4>
                    <div className="space-y-2">
                      {selectedApiServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between bg-white rounded-lg p-2 md:p-3">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className={`${getServiceBg(service.service_name)} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center`}>
                              <img
                                src={service.image}
                                alt={service.service_name}
                                className='w-6 h-6 md:w-8 md:h-8 rounded'
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/32/32";
                                }}
                              />
                            </div>
                            <div>
                              <span className="text-xs md:text-sm font-medium text-gray-900">{service.service_name}</span>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-gray-600">Qty: {service.quantity}</span>
                                <span className="font-bold">₹{service.price * service.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-blue-200 mt-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base md:text-lg font-bold text-gray-900">Total</span>
                        <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ₹{getTotalPrice()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
                    <h5 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                      <Calendar className="w-4 md:w-5 h-4 md:h-5 text-blue-600 mr-2" />
                      When do you need this service?
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Select Date</label>
                        <input
                          type="date"
                          min={getTodayDate()}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-2.5 md:p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-700 font-medium text-sm md:text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Select Time</label>
                        <div className="relative">
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={isTimeSlotsLoading}
                            className="w-full p-2.5 md:p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-700 font-medium appearance-none bg-white text-sm md:text-base disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="">
                              {isTimeSlotsLoading ? "Loading slots..." : "Choose time slot"}
                            </option>
                            {timeSlots.map((slot) => (
                              <option key={slot.id} value={slot.id}>
                                {slot.label} ({slot.name})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <h5 className="text-base md:text-lg font-bold text-gray-900 flex items-center">
                        <MapPin className="w-4 md:w-5 h-4 md:h-5 text-blue-600 mr-2" />
                        Service Address
                      </h5>
                      <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm bg-blue-50 hover:bg-blue-100 px-2 md:px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Plus className="w-3 md:w-4 h-3 md:h-4" />
                        <span>Add New</span>
                      </button>
                    </div>

                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-5 md:p-8">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                        Select Delivery Address
                      </h2>

                      <div className="space-y-2 md:space-y-3 mb-4">
                        {/* Loading State */}
                        {addressLoading ? (
                          <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((_, i) => (
                              <div
                                key={i}
                                className="p-3 md:p-4 border-2 rounded-xl animate-pulse bg-gray-100 h-24"
                              ></div>
                            ))}
                          </div>
                        ) : recentAddress.length === 0 ? (
                          // Empty State
                          <p className="text-center text-gray-500 py-4">
                            No addresses found.
                          </p>
                        ) : (
                          // Address List
                          recentAddress.map((address) => {
                            const AddressIcon = getAddressIcon(address.type);
                            const isSelected = selectedAddress?.id === address.id;

                            return (
                              <div
                                key={address.id}
                                onClick={() => handleSelectAddress(address)}
                                className={`p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01]
              ${isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                  }`}
                              >
                                <div className="flex items-start space-x-2 md:space-x-3">
                                  {/* Icon */}
                                  <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${address.type === "home"
                                        ? "bg-green-100"
                                        : address.type === "work"
                                          ? "bg-blue-100"
                                          : "bg-gray-100"
                                      }`}
                                  >
                                    <AddressIcon
                                      className={`w-4 md:w-5 h-4 md:h-5
                    ${address.type === "home"
                                          ? "text-green-600"
                                          : address.type === "work"
                                            ? "text-blue-600"
                                            : "text-gray-600"
                                        }`}
                                    />
                                  </div>

                                  {/* Address Details */}
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-bold text-gray-900 capitalize text-sm md:text-base">
                                        {address.type}
                                      </span>
                                      <span className="text-xs md:text-sm text-gray-500">•</span>
                                      <span className="text-xs md:text-sm font-medium text-gray-700">
                                        {address.area}
                                      </span>
                                    </div>

                                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                                      {address.address}
                                    </p>

                                    {address.landmark && (
                                      <p className="text-[10px] md:text-xs text-gray-500">
                                        Near {address.landmark}
                                      </p>
                                    )}

                                    <p className="text-[10px] md:text-xs font-medium text-gray-700 mt-1">
                                      PIN: {address.pincode}
                                    </p>
                                  </div>

                                  {/* Check Icon */}
                                  {isSelected && (
                                    <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Selected Address Summary */}
                      {selectedAddress && (
                        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-gray-800">
                          ✅ Selected Address:{" "}
                          <span className="font-semibold">{selectedAddress.area}</span>{" "}
                          ({selectedAddress.type})
                        </div>
                      )}
                    </div>

                    {showAddressForm && (
                      <form
                        onSubmit={handleSubmit}
                        className="w-full space-y-4 bg-gray-50 p-4 rounded-xl shadow"
                      >
                        <h3 className="text-lg font-semibold">Add New Address</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="phone"
                            type="text"
                            placeholder="Phone Number"
                            required
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="alt_address_mob"
                            type="text"
                            placeholder="Alternate Phone"
                            maxLength={10}
                            value={formData.alt_address_mob}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="pincode"
                            type="text"
                            placeholder="Pincode"
                            required
                            maxLength={6}
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="state"
                            type="text"
                            placeholder="State"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="city"
                            type="text"
                            placeholder="City"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="houseNo"
                            type="text"
                            placeholder="House No"
                            required
                            value={formData.houseNo}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="street"
                            type="text"
                            placeholder="Street"
                            required
                            value={formData.street}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <input
                            id="landmark"
                            type="text"
                            placeholder="Famous Landmark"
                            required
                            value={formData.landmark}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <select
                            id="home_office"
                            value={formData.home_office}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                          <textarea
                            id="full_address"
                            placeholder="Full Address (additional details)"
                            rows="2"
                            value={formData.full_address}
                            onChange={handleInputChange}
                            className="p-3 border-2 rounded-lg focus:border-blue-500 outline-none md:col-span-2"
                          />
                        </div>

                        {message && <p className="text-red-500 text-sm">{message}</p>}

                        <div className="flex justify-end gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="hidden md:grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">Safe & Sanitized</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">Expert Technicians</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">100% Satisfaction</span>
                    </div>
                  </div>
                  
                  <div className="sticky bottom-0 bg-white pt-3 md:pt-4 border-t border-gray-100">
                    <button
                      onClick={handlePaymentCompleted}
                      disabled={!selectedDate || !selectedTime || !selectedAddress || selectedApiServices.length === 0}
                      className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 font-bold text-sm md:text-lg flex items-center justify-center space-x-2 md:space-x-3 transform hover:scale-105 shadow-lg ${selectedDate && selectedTime && selectedAddress && selectedApiServices.length > 0
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-2xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <ShoppingCart className="w-5 md:w-6 h-5 md:h-6" />
                      <span>Book {selectedApiServices.length} Service{selectedApiServices.length > 1 ? 's' : ''}</span>
                      <span className="bg-white/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm">
                        ₹{getTotalPrice()}
                      </span>
                      <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      // onLoginSuccess={onLoginSuccess}
      />
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .modal-enter {
          opacity: 0;
          transform: scale(0.9);
        }

        .modal-enter-active {
          opacity: 1;
          transform: scale(1);
        }

        .modal-exit {
          opacity: 0;
          transform: scale(0.95);
        }

        .modal-content {
          animation: modalBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes modalBounce {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotate(2deg);
          }
          70% {
            transform: scale(0.98) rotate(-1deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .modal-content {
            animation: modalSlideUp 0.3s ease-out;
          }

          @keyframes modalSlideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </>
  );
};

export default ROServices;
