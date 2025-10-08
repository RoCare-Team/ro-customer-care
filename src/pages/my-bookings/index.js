"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import {
  FiHome,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiPhone,
  FiUpload,
  FiX,
  FiRefreshCw,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiImage,
  FiHash,
  FiAlertCircle,
  FiWifiOff,
  FiTool,
  FiTag,
  FiUserCheck,
  FiMaximize2,
  FiLoader
} from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Booking() {
  const [activeTab, setActiveTab] = useState("Active");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Cancellation modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reasonsLoading, setReasonsLoading] = useState(false);

  const router = useRouter();

  // Network status detection
  useEffect(() => {
    setIsMounted(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch data when tab changes or component mounts
  useEffect(() => {
    if (isMounted) {
      fetchBookings();
    }
  }, [activeTab, isMounted]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      setBookings([]);
      
      const phone = localStorage.getItem("userPhone");
      if (!phone) {
        router.push("/");
        return;
      }

      const statusMap = {
        "Active": "1",
        "Completed": "2",
        "Cancelled": "3"
      };

      const response = await fetch('/api/bookings/booking', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_no: phone,
          status: statusMap[activeTab]
        }),
      });

      console.log("resssssssss",response);
      

      if (!response.ok) {
        // throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.complainDetails?.length) {
        setBookings([]);
        return;
      }

      setBookings(data.complainDetails.map(item => ({
        id: item.lead_id || "N/A",
        status: item.status || "Unknown",
        serviceType: item.lead_type || "Unknown Service",
        bookingDate: formatDate(item.lead_add_date),
        amount: item.payment_with_wallet_discount || "0",
        paymentStatus: item.payment_status || "Pending",
        paymentMode: item.payment_mode || "N/A",
        image: item.image || null,
        call_to_number: "+911234567890"
      })));
    } catch (err) {
      console.error("Booking fetch error:", err);
      setError(
        err.message === "Failed to fetch" 
          ? "Network error. Please check your connection."
          : err.message || "Failed to load bookings. Please try again."
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cancellation reasons from your API
// ...
const fetchCancelReasons = async () => {
  try {
    setReasonsLoading(true);
    
    const response = await fetch('/api/bookings/cancel-reasons/cancelReason', {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reasons: ${response.status}`);
    }

    const data = await response.json();
    
    // Corrected line to access the nested cancel_reason array
    setCancelReasons(data?.reasons?.cancel_reason || []);
  } catch (err) {
    console.error("Error fetching cancel reasons:", err);
    // Fallback reasons if API fails
    setCancelReasons([
      { id: 1, reason: "Changed my mind" },
      { id: 2, reason: "Found a better service provider" },
      { id: 3, reason: "Emergency came up" },
      { id: 4, reason: "Technical issues" },
      { id: 5, reason: "Price concerns" },
      { id: 6, reason: "Other" }
    ]);
  } finally {
    setReasonsLoading(false);
  }
};
// ...
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleViewBooking = async (booking) => {
    try {
      setLoading(true);
      
      const phone = localStorage.getItem("userPhone");
      if (!phone) {
        router.push("/");
        return;
      }

      const response = await fetch('/api/booking-details/bookingDetails', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_no: phone,
          lead_id: booking.id
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data?.error === false && data?.service_details?.[0]) {
        const details = data.service_details[0];
        setSelectedBooking({
          ...booking,
          name: details.name || "N/A",
          address: details.address || "N/A",
          mobile: details.mobile || "N/A",
          date: details.appointment_date || "N/A",
          time: details.appointment_time || "N/A",
          payment_status: details.payment_status || "Pending",
          image: details.product_image || booking.image,
          email: details.email || "N/A",
          call_to_number: details.call_to_number || "+911234567890"
        });
      } else {
        setSelectedBooking(booking);
      }
    } catch (err) {
      console.error("Failed to fetch booking details:", err);
      setSelectedBooking(booking);
    } finally {
      setLoading(false);
      setViewModalOpen(true);
    }
  };

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      "Complete": { bg: "bg-green-100", text: "text-green-800", icon: <FiCheckCircle /> },
      "Completed": { bg: "bg-green-100", text: "text-green-800", icon: <FiCheckCircle /> },
      "Active": { bg: "bg-blue-100", text: "text-blue-800", icon: <FiClock /> },
      "Follow-up": { bg: "bg-yellow-100", text: "text-yellow-800", icon: <FiClock /> },
      "Cancelled": { bg: "bg-red-100", text: "text-red-800", icon: <FiXCircle /> },
      "Inactive": { bg: "bg-red-100", text: "text-red-800", icon: <FiXCircle /> },
      default: { bg: "bg-gray-100", text: "text-gray-800", icon: null }
    };

    const { bg, text, icon } = statusConfig[status] || statusConfig.default;

    return (
      <span className={`${bg} ${text} px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {icon && React.cloneElement(icon, { className: "mr-1" })}
        {status}
      </span>
    );
  };

  const PaymentStatusBadge = ({ status }) => {
    const statusConfig = {
      "Paid": { bg: "bg-green-100", text: "text-green-800" },
      "Pending": { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Failed": { bg: "bg-red-100", text: "text-red-800" },
      default: { bg: "bg-gray-100", text: "text-gray-800" }
    };

    const { bg, text } = statusConfig[status] || statusConfig.default;

    return (
      <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs font-medium`}>
        {status}
      </span>
    );
  };

  // Open cancel modal and fetch reasons
  const handleOpenCancelModal = async (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
    setSelectedReason("");
    setCancelComment("");
    await fetchCancelReasons();
  };
const handleCancelBooking = async () => {
  // Add this validation to ensure a reason is selected
  if (!selectedReason) {
    alert("Please select a reason for cancellation.");
    return;
  }

  try {
    setCancelLoading(true);
    
    // The key change is to ensure selectedReason is not empty and is correctly passed
    const response = await fetch('/api/bookings/cancel/cancelBooking', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lead_id: selectedBooking.id,
        reason: selectedReason, // <-- This is the key part that needs to be correct
        comment: cancelComment || ""
      }),
    });

    console.log("response",response);
    

    if (!response.ok) {
      throw new Error(`Failed to cancel: ${response.status}`);
    }

    const result = await response.json();
    
    // Check for success based on your API response structure
    if (result.success || result.error === false || result.status === 'success') {
      // Close modals
      setCancelModalOpen(false);
      setViewModalOpen(false);
      
      // Reset form
      setSelectedReason("");
      setCancelComment("");
      
      // *** NEW LINE ADDED HERE ***
      // Automatically switch to the "Cancelled" tab to show the new booking
      setActiveTab("Cancelled");
      
      alert("Booking cancelled successfully!");
    } else {
      throw new Error(result.message || result.error || "Failed to cancel booking");
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    alert(error.message || "Failed to cancel booking. Please try again.");
  } finally {
    setCancelLoading(false);
  }
};
  const handleCallSupport = () => {
    const supportNumber = selectedBooking?.call_to_number || "+911234567890";
    window.open(`tel:${supportNumber}`, "_self");
  };

  const renderEmptyState = () => {
    if (!isOnline) {
      return (
        <div className="text-center py-8 sm:py-10">
          <div className="mx-auto bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FiWifiOff className="text-red-500 text-2xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No Internet Connection
          </h4>
          <p className="text-gray-500 mb-6">
            Please check your network and try again.
          </p>
          <button 
            onClick={fetchBookings}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-2xl text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 sm:py-10">
          <div className="mx-auto bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FiAlertCircle className="text-red-500 text-2xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Error Loading Data
          </h4>
          <p className="text-gray-500 mb-6">
            {error}
          </p>
          <button 
            onClick={fetchBookings}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-2xl text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="text-center py-8 sm:py-10">
        <div className="mx-auto bg-gray-100 p-3 sm:p-4 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4">
          <FiClock className="text-gray-400 text-2xl sm:text-3xl" />
        </div>
        <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
          No {activeTab === "Active" ? "Active" : activeTab === "Completed" ? "Completed" : "Cancelled"} Bookings
        </h4>
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto px-4">
          {activeTab === "Active"
            ? "You don't have any active bookings at the moment."
            : activeTab === "Completed"
            ? "Your completed services will appear here."
            : "Cancelled services will appear here."}
        </p>
        {/* <Link href={"/service"}> */}
          <button className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-2xl text-sm sm:text-base" onClick={fetchBookings}>
            Explore Our Services
          </button>
        {/* </Link> */}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Booking History | Your Service Bookings</title>
        <meta name="description" content="View your active, completed, and cancelled service bookings." />
      </Head>

  <Navbar/>
      

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50 p-4 mt-4">
        <div className="w-full max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center text-left mb-6 px-2">
            <Link href={"/"} className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
              <FiHome className="mr-2" />
              <span>Home</span>
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-blue-600 font-medium">Booking History</span>
          </div>

          {/* Main Card */}
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-blue-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Your Service Bookings</h3>
                  <p className="text-blue-100 mt-1">
                    {activeTab === "Active" ? "Active & upcoming services" : 
                     activeTab === "Completed" ? "Completed services" : "Cancelled services"}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                  <span className="text-white text-sm font-semibold">
                    {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-3 bg-gradient-to-b from-blue-50 to-white p-4 border-b border-blue-100">
              {["Active", "Completed", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? `bg-gradient-to-r ${
                          tab === "Active" ? "from-blue-600 to-sky-600" : 
                          tab === "Completed" ? "from-emerald-600 to-green-600" : "from-rose-600 to-red-600"
                        } text-white shadow-lg`
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab === "Active" ? <FiClock /> : 
                   tab === "Completed" ? <FiCheckCircle /> : <FiXCircle />}
                  {tab}
                  {activeTab === tab && (
                    <span className={`bg-white ${
                      tab === "Active" ? "text-blue-700" : 
                      tab === "Completed" ? "text-emerald-700" : "text-rose-700"
                    } font-bold px-2 py-0.5 text-xs rounded-full`}>
                      {bookings.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 mt-4">Loading bookings...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bookings.map((service) => (
                    <div key={service.id} className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all group">
                      <div className="flex flex-col h-full">
                        {/* Booking ID */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full">
                            <FiHash className="text-blue-600 text-xs" />
                            <span className="text-xs font-mono font-semibold text-blue-700">ID: {service.id}</span>
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-sky-100 p-3 rounded-xl">
                            <FiCalendar className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                              {service.serviceType}
                            </h4>
                            <p className="text-sm text-slate-500">
                              Booked on {service.bookingDate}
                            </p>
                          </div>
                        </div>

                        {/* Status and Amount */}
                        <div className="flex justify-between items-center mb-5">
                          <StatusBadge status={service.status} />
                          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                            ₹{service.amount}
                          </p>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => handleViewBooking(service)}
                          className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <FiEye />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Booking Modal */}
      {viewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 p-6 rounded-t-3xl sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-bold text-white">Booking Summary</h3>
                  <p className="text-blue-100 mt-1">ID: #{selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Customer Details */}
                    <div className="space-y-5">
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <FiUser className="text-blue-600" />
                          Customer Information
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</p>
                            <p className="font-semibold text-slate-900">{selectedBooking.name || "Not provided"}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact</p>
                            <p className="font-semibold text-slate-900">{selectedBooking.mobile || "Not provided"}</p>
                            {selectedBooking.email && (
                              <p className="text-sm text-slate-600 mt-1">{selectedBooking.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Address</p>
                            <p className="font-semibold text-slate-900 whitespace-pre-line">
                              {selectedBooking.address || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-5">
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-100">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <FiCalendar className="text-blue-600" />
                          Appointment Details
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date & Time</p>
                            <div className="flex flex-wrap gap-2">
                              <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                                {selectedBooking.date || "Not set"}
                              </div>
                              {selectedBooking.time && (
                                <div className="bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                                  {selectedBooking.time}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment</p>
                            <div className="flex items-center justify-between">
                              <PaymentStatusBadge status={selectedBooking.payment_status} />
                              <span className="font-bold text-slate-900 text-lg">₹{selectedBooking.amount || "0"}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</p>
                            <StatusBadge status={selectedBooking.status} />
                          </div>
                        </div>
                      </div>

                      {/* Support Card */}
                      <div className="bg-gradient-to-br from-blue-600 to-sky-600 p-5 rounded-2xl text-white">
                        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          <FiPhone />
                          Need Help?
                        </h4>
                        <p className="text-blue-100 text-sm mb-3">
                          Contact our support team for assistance
                        </p>
                        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                          <FiPhone className="flex-shrink-0" />
                          <a 
                            href={`tel:${selectedBooking.call_to_number}`}
                            className="text-lg font-bold hover:underline"
                          >
                            {selectedBooking.call_to_number}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Image */}
                  {selectedBooking.image && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <FiImage className="text-blue-600" />
                        Service Reference
                      </h4>
                      <div className="relative group">
                        <div className="w-full h-72 bg-slate-100 rounded-2xl border-2 border-blue-100 overflow-hidden">
                          <img
                            src={selectedBooking.image}
                            alt="Service reference"
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              e.target.src = 'https://www.waterpurifierservicecenter.in/customer_app_images/service_and_repair.jpg';
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => window.open(selectedBooking.image, '_blank')}
                            className="bg-white hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all"
                          >
                            <FiMaximize2 size={16} />
                            <span className="text-sm font-semibold">View Full Size</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleCallSupport}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                      <FiPhone size={18} />
                      Call Support
                    </button>

                    {selectedBooking.status === "Active" && (
                      <button
                        onClick={() => handleOpenCancelModal(selectedBooking)}
                        className="flex-1 bg-white border-2 border-rose-300 hover:bg-rose-50 text-rose-600 px-6 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg font-semibold"
                      >
                        <FiXCircle size={18} />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col">
            {/* Cancel Header */}
            <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6 rounded-t-3xl flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">Cancel Booking</h3>
                  <p className="text-rose-100 mt-1 text-sm">ID: #{selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Cancel Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="text-center mb-6">
                <div className="mx-auto bg-rose-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <FiAlertCircle className="text-rose-600 text-2xl" />
                </div>
                <p className="text-slate-700 text-sm">
                  Please select a reason for cancelling this booking. This helps us improve our services.
                </p>
              </div>

              {/* Cancellation Reasons */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Cancellation Reason *
                </label>
                
                {reasonsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-slate-400 text-2xl mr-2" />
                    <span className="text-slate-500">Loading reasons...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Array.isArray(cancelReasons) &&
                      cancelReasons.map((reason, index) => {
                        const reasonText = typeof reason === 'object' ? reason.reason : reason;
                        const reasonId = `reason-${index}`;
                        return (
                          <label
                            key={index}
                            htmlFor={reasonId}
                            className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all border-2 ${
                              selectedReason === reasonText
                                ? 'bg-rose-50 border-rose-500 text-rose-700'
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              id={reasonId}
                              name="cancellationReason"
                              value={reasonText}
                              checked={selectedReason === reasonText}
                              onChange={(e) => setSelectedReason(e.target.value)}
                              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-300 mr-3"
                            />
                            <span className="text-sm font-medium">{reasonText}</span>
                          </label>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Additional Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Additional Comment (Optional)
                </label>
                <textarea
                  value={cancelComment}
                  onChange={(e) => setCancelComment(e.target.value)}
                  placeholder="Please provide any additional details..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {cancelComment.length}/500 characters
                </p>
              </div>

              {/* Warning Message */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <FiAlertCircle className="text-amber-600 text-lg mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800">Important Notice</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Once cancelled, this booking cannot be restored. You may need to create a new booking for future services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all"
                  disabled={cancelLoading}
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={!selectedReason || cancelLoading}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:from-rose-300 disabled:to-red-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {cancelLoading ? (
                    <>
                      <FiLoader className="animate-spin text-sm" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FiXCircle className="text-sm" />
                      Cancel Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
}

export default Booking;