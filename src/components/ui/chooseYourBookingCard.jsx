import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ChooseYourSlot = ({ savedAddress }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(
    savedAddress || {
      name: "",
      mobile: "",
      houseNumber: "",
      street: "",
      city: "",
      pincode: "",
      date: "",
      timeSlot: "",
    }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [useSaved, setUseSaved] = useState(!!savedAddress);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleBooking = () => {
    setBookingConfirmed(true);
    setShowToast(true);

    // Hide toast after 2 seconds and redirect
    setTimeout(() => {
      setShowToast(false);
      router.push("/");
    }, 2000);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setStep(1);
    setBookingConfirmed(false);
    setUseSaved(!!savedAddress);
    if (!savedAddress) {
      setFormData({
        name: "",
        mobile: "",
        houseNumber: "",
        street: "",
        city: "",
        pincode: "",
        date: "",
        timeSlot: "",
      });
    }
  };

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const steps = ["Address", "Date & Time", "Confirm"];

  return (
    <div className="bg-white max-w-8xl p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
        Booking Page
      </h1>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce z-[9999]">
          ✅ Booking Confirmed! Redirecting...
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={handleClose}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-10 p-8">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={handleClose}
            >
              ✕
            </button>

            {/* Stepper */}
            <div className="flex justify-between mb-6">
              {steps.map((s, index) => (
                <div key={s} className="flex-1 text-center relative">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full text-white flex items-center justify-center text-lg font-bold mb-1 transition-all duration-300 ${
                      step === index + 1
                        ? "bg-blue-500 scale-110"
                        : index + 1 < step
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {s}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-full w-full h-1 bg-gray-300 -translate-x-1/2 z-0"></div>
                  )}
                </div>
              ))}
            </div>

            {!bookingConfirmed && (
              <div className="space-y-4">
                {/* Step 1: Address */}
                {step === 1 && (
                  <div className="space-y-2">
                    {savedAddress && !useSaved && (
                      <button
                        className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 mb-3 transition"
                        onClick={() => {
                          setFormData(savedAddress);
                          setUseSaved(true);
                        }}
                      >
                        Use Saved Address
                      </button>
                    )}
                    {["name", "mobile", "houseNumber", "street", "city", "pincode"].map((field) => (
                      <input
                        key={field}
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={
                          field === "houseNumber"
                            ? "House Number"
                            : field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ))}
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <div className="space-y-4">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]} // ✅ can't pick past dates
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select Time Slot</option>
                      <option value="10:00 AM - 12:00 PM">
                        10:00 AM - 12:00 PM
                      </option>
                      <option value="12:00 PM - 2:00 PM">
                        12:00 PM - 2:00 PM
                      </option>
                      <option value="2:00 PM - 4:00 PM">
                        2:00 PM - 4:00 PM
                      </option>
                      <option value="4:00 PM - 6:00 PM">
                        4:00 PM - 6:00 PM
                      </option>
                    </select>
                  </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                  <div className="space-y-3 text-gray-800 bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {formData.mobile}
                    </p>
                    <p>
                      <strong>Address:</strong> {formData.houseNumber},{" "}
                      {formData.street}, {formData.city}, {formData.pincode}
                    </p>
                    <p>
                      <strong>Date:</strong> {formData.date}
                    </p>
                    <p>
                      <strong>Time Slot:</strong> {formData.timeSlot}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      disabled={
                        (step === 1 &&
                          (!formData.name ||
                            !formData.mobile ||
                            !formData.houseNumber ||
                            !formData.street ||
                            !formData.city ||
                            !formData.pincode)) ||
                        (step === 2 &&
                          (!formData.date || !formData.timeSlot))
                      }
                      className={`px-5 py-2 rounded-lg text-white transition ${
                        (step === 1 &&
                          formData.name &&
                          formData.mobile &&
                          formData.houseNumber &&
                          formData.street &&
                          formData.city &&
                          formData.pincode) ||
                        (step === 2 &&
                          formData.date &&
                          formData.timeSlot)
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleBooking}
                      className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseYourSlot;
