"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Calendar, Plus, CreditCard, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { getCartItems } from "@/utils/cardData";

export default function CheckoutComp() {
  // ---------------- CART ----------------
  const [cartData, setCartData] = useState([]);
  const [width, setWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const totalItems = cartData.reduce(
    (acc, cur) => acc + (parseInt(cur.quantity) || 0),
    0
  );
  const totalAmount = cartData.reduce(
    (acc, cur) => acc + (parseFloat(cur.total_price) || 0),
    0
  );

  // ---------------- ADDRESS ----------------
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [recentAddress, setRecentAddress] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    home_office: "home",
    phone: "",
  });


  console.log("selectedAddress", selectedAddress);


  const handleSubmitAddress = async (e) => {
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

  // ---------------- DATE & TIME SLOTS ----------------
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchTimeSlots = useCallback(async (date) => {
    if (!date) return;
    try {
      setLoadingSlots(true);
      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/time_slot.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        }
      );
      const data = await res.json();
      const slots = Array.isArray(data.all_time_slots)
        ? data.all_time_slots.map((s) => ({ id: s.id, label: s.time_slots }))
        : [];
      setTimeSlots(slots);
    } catch (err) {
      console.error(err);
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchTimeSlots(date);
  };

  // ---------------- PAYMENT ----------------
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const loadRecentAddresses = () => {
    try {
      const stored = localStorage.getItem('RecentAddress');
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentAddress(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Error loading recent addresses:', error);
      setRecentAddress([]);
    }
  };

  const handlePaymentCompleted = async (leadtype, redirect = true) => {
    const cust_id = localStorage.getItem("customer_id");
    const cust_mobile = localStorage.getItem("userPhone");
    const address_id = selectedAddress;
    const cust_email = localStorage.getItem("email") || localStorage.getItem("userEmail");

    const chkout = JSON.parse(localStorage.getItem("checkoutState") || "[]");
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const cart_id = chkout[0]?.category_cart_id;

    const appointment_time = selectedSlot;
    const appointment_date = selectedDate;

    const source = 'Testing RoServiceCare';

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

        const itemsToRemove = [
          "bookingTimeSlot",
          "bookingAddress",
          "time_slot",
          "address_id",
        ];

        itemsToRemove.forEach(item => {
          localStorage.removeItem(item);
        });

        if (redirect) {
          setTimeout(() => {
            window.location.href = data.lead_id_for_payment;
          }, 100);
        } else {
          toast.success("Thank You!....");
        }
      } else {
        toast.error(data.msg || "Payment processing failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Payment error:", error);
    }
  };

  // Load all client-side data after component mounts
  useEffect(() => {
    setIsClient(true);
    const savedCart = getCartItems() || [];
    setCartData(savedCart);
    loadRecentAddresses();
    setWidth(window.innerWidth);
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 text-gray-700 dark:text-gray-800">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT: CART SUMMARY */}
        <div className="bg-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {cartData && cartData.length > 0 ? (
            cartData?.map((item, idx) => {
              const quantity = parseInt(item.quantity, 10) || 0;
              const total = parseFloat(item.price) || 0;

              return (
                <div key={idx} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold">{item.service_name}</p>
                    <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                  </div>
                  <div>₹{total}</div>
                </div>
              )
            })
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
          <div className="flex justify-between text-lg font-bold mt-3">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* RIGHT: ADDRESS, DATE, PAYMENT */}
        <div className="p-6 space-y-6">
          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Select Address
            </h3>

            <select
              value={selectedAddress || ""}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full p-2 border rounded-xl mb-3"
            >
              <option value="" disabled>
                -- Select an Address --
              </option>
              {recentAddress.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name} - {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </option>
              ))}
            </select>

            {!showAddressForm && (
              <button
                className="flex items-center text-blue-600 font-semibold mt-2"
                onClick={() => setShowAddressForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add New Address
              </button>
            )}

            {showAddressForm && (
              <form
                onSubmit={handleSubmitAddress}
                className="border p-4 rounded-xl mt-3 space-y-2"
              >
                {[
                  "name",
                  "houseNo",
                  "street",
                  "landmark",
                  "city",
                  "state",
                  "pincode",
                  "phone",
                ].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                ))}
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Date & Slot */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Choose Date &
              Time
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded mb-2"
            />
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!selectedDate || loadingSlots}
            >
              <option value="">Select a slot</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.label}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment */}
          {/* <div className="space-y-3">
            <button
              onClick={() => setSelectedPayment("card")}
              className={`flex items-center p-3 border rounded-xl w-full ${selectedPayment === "card"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
                }`}
            >
              <CreditCard className="w-5 h-5 mr-3 text-blue-600" /> Card Payment
            </button>
            <button
              onClick={() => setSelectedPayment("cod")}
              className={`flex items-center p-3 border rounded-xl w-full ${selectedPayment === "cod"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
                }`}
            >
              <Truck className="w-5 h-5 mr-3 text-blue-600" /> Cash on Delivery
            </button>
          </div> */}

          {/* Place Order */}
          <button
            onClick={handlePaymentCompleted}
            disabled={
              !selectedAddress || !selectedDate || !selectedSlot || !cartData.length
            }
            className="w-full bg-blue-600 text-white py-3 font-semibold rounded-xl disabled:bg-gray-300"
          >
            Place Order
          </button>
        </div>:
      </div>
    </div>
  );
}