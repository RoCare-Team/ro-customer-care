"use client"

import { useState } from "react"
import { CreditCard, Truck, ShieldCheck, MapPin, Calendar, Plus } from "lucide-react"

export default function CheckoutComponent() {
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [addresses, setAddresses] = useState([
    { id: 1, name: "John Doe", street: "123 Street", locality: "Area 51", city: "City", state: "State", pincode: "123456", default: true },
    { id: 2, name: "Office", street: "456 Avenue", locality: "Downtown", city: "City", state: "State", pincode: "654321", default: false },
  ])

  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  })

  const [selectedSlot, setSelectedSlot] = useState("");
  
  const slots = ["10:00 AM - 12:00 PM","12:00 PM - 2:00 PM","2:00 PM - 4:00 PM","4:00 PM - 6:00 PM"]

  // Set default address on load
  useState(() => {
    const defaultAddr = addresses.find(addr => addr.default)
    if (defaultAddr) setSelectedAddress(defaultAddr.id)
  })

  const handleAddAddress = () => {
    const id = addresses.length + 1
    setAddresses([...addresses, { id, ...newAddress }])
    setSelectedAddress(id)
    setNewAddress({ name: "", street: "", locality: "", city: "", state: "", pincode: "" })
    setShowNewAddressForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-4">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Section – Order Summary */}
        <div className="bg-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-700">Service</span>
                <span className="font-semibold">RO Repair</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-700">Price</span>
                <span className="font-semibold">₹399</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-700">Visit Charges</span>
                <span className="font-semibold">₹50</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹449</span>
            </div>
          </div>
        </div>

        {/* Right Section – Payment & Checkout */}
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>

          {/* Address Section */}
          <div className="mb-4">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Select Address
            </h3>

            {/* Existing Addresses */}
            {addresses.length > 0 && !showNewAddressForm && (
              <div className="space-y-2">
                {addresses.map(addr => (
                  <label
                    key={addr.id}
                    className={`flex flex-col p-3 border rounded-xl cursor-pointer transition ${
                      selectedAddress === addr.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mb-1"
                    />
                    <span className="text-gray-700 font-semibold">{addr.name}</span>
                    <span className="text-gray-500 text-sm">
                      {addr.street}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                    </span>
                  </label>
                ))}

                <button
                  type="button"
                  className="flex items-center text-blue-600 font-semibold mt-2"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add New Address
                </button>
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <div className="space-y-2 border p-4 rounded-xl">
                <input
                  type="text"
                  placeholder="Name"
                  value={newAddress.name}
                  onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Street / House No."
                  value={newAddress.street}
                  onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Locality"
                  value={newAddress.locality}
                  onChange={e => setNewAddress({ ...newAddress, locality: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full p-2 border rounded"
                />

                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleAddAddress}
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Slot Selection */}
          <div className="mb-4">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Choose Slot
            </h3>
            <select
              value={selectedSlot}
              onChange={e => setSelectedSlot(e.target.value)}
              className="w-full p-3 border rounded-xl"
            >
              <option value="" disabled>
                Select a slot
              </option>
              {slots.map((slot, idx) => (
                <option key={idx} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <button
              onClick={() => setSelectedPayment("card")}
              className={`flex items-center p-3 border rounded-xl w-full transition ${
                selectedPayment === "card"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
              <span className="text-gray-700">Credit / Debit Card</span>
            </button>

            <button
              onClick={() => setSelectedPayment("cod")}
              className={`flex items-center p-3 border rounded-xl w-full transition ${
                selectedPayment === "cod"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <Truck className="w-5 h-5 mr-3 text-blue-600" />
              <span className="text-gray-700">Cash on Delivery</span>
            </button>
          </div>

          {/* Secure Info */}
          <div className="flex items-center text-sm text-gray-500">
            <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
            <span>100% Secure Payment</span>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-2">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
