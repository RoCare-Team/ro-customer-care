import { useState, useEffect, useRef, useCallback } from "react";
import { X, Phone, Key, ArrowLeft, CheckCircle, AlertTriangle, RotateCcw, Shield } from "lucide-react";
import { useAuth } from "@/contexts/userAuth";

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const { handleLoginSuccess } = useAuth();

  // Simplified state management
  const [state, setState] = useState({
    mobileNumber: "",
    otpDigits: ["", "", "", ""],
    isSubmitting: false,
    error: "",
    successMessage: "",
    step: "mobile", // 'mobile' or 'otp'
    resendTime: 0,
  });

  // OTP input refs
  const otpInputRefs = useRef(
    Array(4).fill().map(() => ({ current: null }))
  );

  // Reset form when modal closes
  const resetForm = useCallback(() => {
    setState({
      mobileNumber: "",
      otpDigits: ["", "", "", ""],
      error: "",
      successMessage: "",
      step: "mobile",
      isSubmitting: false,
      resendTime: 0,
    });
  }, []);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !state.isSubmitting) {
      resetForm();
      onClose();
    }
  }, [onClose, resetForm, state.isSubmitting]);

  // Handle phone number input
  const handlePhoneChange = useCallback((value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      setState(prev => ({
        ...prev,
        mobileNumber: cleanValue,
        error: cleanValue.length === 10 ? "" : prev.error
      }));
    }
  }, []);

  // Send OTP
  // const sendOTP = useCallback(async (resend = false) => {
  //   const { mobileNumber } = state;

  //   if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
  //     setState(prev => ({
  //       ...prev,
  //       error: "Please enter a valid 10-digit mobile number"
  //     }));
  //     return;
  //   }

  //   setState(prev => ({
  //     ...prev,
  //     isSubmitting: true,
  //     error: "",
  //     successMessage: ""
  //   }));

  //   try {
  //     const response = await fetch(
  //       "https://waterpurifierservicecenter.in/customer/ro_customer/roservice_sendotp.php",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ phoneNumber: mobileNumber }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     if (data.error === false) {
  //       setState(prev => ({
  //         ...prev,
  //         successMessage: "OTP sent successfully! Please check your messages.",
  //         step: resend ? prev.step : "otp",
  //         resendTime: 30,
  //         isSubmitting: false
  //       }));
  //     } else {
  //       throw new Error(data.msg || "Failed to send OTP");
  //     }
  //   } catch (err) {
  //     console.error("Send OTP Error:", err);
  //     setState(prev => ({
  //       ...prev,
  //       error: err.message || "Failed to send OTP. Please try again.",
  //       isSubmitting: false
  //     }));
  //   }
  // }, [state.mobileNumber]);
const sendOTP = useCallback(async (resend = false) => {
  const { mobileNumber } = state;

  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    setState(prev => ({
      ...prev,
      error: "Please enter a valid 10-digit mobile number"
    }));
    return;
  }

  setState(prev => ({
    ...prev,
    isSubmitting: true,
    error: "",
    successMessage: ""
  }));

  try {
    // ✅ Test mode: hardcoded OTP
    const data = {
      error: false,
      otp: "1234" // <-- fixed OTP for testing
    };

    if (data.error === false) {
      setState(prev => ({
        ...prev,
        successMessage: `OTP sent successfully! (Use ${data.otp} for testing)`,
        step: resend ? prev.step : "otp",
        resendTime: 30,
        isSubmitting: false
      }));
    } else {
      throw new Error(data.msg || "Failed to send OTP");
    }
  } catch (err) {
    console.error("Send OTP Error:", err);
    setState(prev => ({
      ...prev,
      error: err.message || "Failed to send OTP. Please try again.",
      isSubmitting: false
    }));
  }
}, [state.mobileNumber]);

  // Handle OTP input
  const handleOtpChange = useCallback((index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    setState(prev => {
      const newOtpDigits = [...prev.otpDigits];
      newOtpDigits[index] = value;

      // Auto-focus next input
      if (value && index < 3 && otpInputRefs.current[index + 1]) {
        setTimeout(() => {
          otpInputRefs.current[index + 1].current?.focus();
        }, 0);
      }

      return { ...prev, otpDigits: newOtpDigits, error: "" };
    });
  }, []);

  // Handle OTP input keydown
  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !state.otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs.current[index + 1].current?.focus();
    }
  }, [state.otpDigits]);

// Verify OTP
// const verifyOTP = useCallback(async () => {
//   const otp = state.otpDigits.join('');
//   if (!otp || !/^\d{4}$/.test(otp)) {
//     setState(prev => ({
//       ...prev,
//       error: "Please enter a valid 4-digit OTP"
//     }));
//     return;
//   }

//   setState(prev => ({
//     ...prev,
//     isSubmitting: true,
//     error: "",
//     successMessage: ""
//   }));

//   try {
//     const response = await fetch(
//       "https://waterpurifierservicecenter.in/customer/ro_customer/service_otp_verify.php",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           phoneNumber: state.mobileNumber,
//           newOtp: otp
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (data.error === false) {
//       // ✅ Save user data
//       const userDataToStore = {
//         userPhone: state.mobileNumber,
//         userToken: 'verified',
//         userName: data.name || '',
//         userEmail: data.email || '',
//         customer_id: data.c_id,
//         RecentAddress: JSON.stringify(data.address || []),
//         checkoutState: JSON.stringify(data.AllCartDetails || []),
//         cart_total_price: data.total_price || 0
//       };

//       Object.entries(userDataToStore).forEach(([key, value]) => {
//         if (value) localStorage.setItem(key, String(value));
//       });

//       handleLoginSuccess({
//         id: data.c_id,
//         phone: state.mobileNumber,
//         name: data.name || "Customer",
//         email: data.email || "",
//       });

//       setState(prev => ({
//         ...prev,
//         successMessage: `Welcome back ${data.name || ''}! You've been successfully logged in.`,
//         isSubmitting: false
//       }));

//       // ✅ Close modal
//       onClose();

//       // ✅ Reload page after 1s
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);

//     } else {
//       // ✅ OTP galat hone par sirf error set hoga
//       setState(prev => ({
//         ...prev,
//         error: data.msg || "OTP verification failed",
//         isSubmitting: false
//       }));
//       return;
//     }
//   } catch (err) {
//     console.error("Verify OTP Error:", err);
//     setState(prev => ({
//       ...prev,
//       error: err.message || "OTP verification failed. Please try again.",
//       isSubmitting: false
//     }));
//   }
// }, [state.mobileNumber, state.otpDigits, onLoginSuccess, onClose, resetForm]);

const verifyOTP = useCallback(async () => {
  const otp = state.otpDigits.join('');

  // ✅ Check against hardcoded OTP
  if (otp !== "1234") {
    setState(prev => ({
      ...prev,
      error: "OTP does not match! Please enter 1234",
      isSubmitting: false
    }));
    return;
  }

  // ✅ Success flow without API call
  setState(prev => ({
    ...prev,
    isSubmitting: true,
    error: "",
    successMessage: ""
  }));

  try {
    // 👉 Dummy response for testing
    const data = {
      error: false,
      c_id: "TEST123",
      name: "Demo User",
      email: "demo@example.com",
      address: [],
      AllCartDetails: [],
      total_price: 0
    };

    // ✅ Save user data in localStorage
    const userDataToStore = {
      userPhone: "9999999999",
      userToken: 'verified',
      userName: data.name,
      userEmail: data.email,
      customer_id: data.c_id,
      RecentAddress: JSON.stringify(data.address),
      checkoutState: JSON.stringify(data.AllCartDetails),
      cart_total_price: data.total_price
    };

    Object.entries(userDataToStore).forEach(([key, value]) => {
      if (value) localStorage.setItem(key, String(value));
    });

    handleLoginSuccess({
      id: data.c_id,
      phone: state.mobileNumber,
      name: data.name,
      email: data.email,
    });

    setState(prev => ({
      ...prev,
      successMessage: `Welcome back ${data.name}! You've been successfully logged in.`,
      isSubmitting: false
    }));

    onClose();

    // ✅ Reload page after 1 sec
    setTimeout(() => {
      window.location.reload();
    }, 100);

  } catch (err) {
    console.error("Verify OTP Error:", err);
    setState(prev => ({
      ...prev,
      error: "Unexpected error. Please try again.",
      isSubmitting: false
    }));
  }
}, [state.mobileNumber, state.otpDigits, onLoginSuccess, onClose, resetForm]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: "", successMessage: "" }));
    state.step === "mobile" ? sendOTP() : verifyOTP();
  }, [state.step, sendOTP, verifyOTP]);

  // Resend timer effect
  useEffect(() => {
    let timer;
    if (state.resendTime > 0) {
      timer = setTimeout(() => {
        setState(prev => ({ ...prev, resendTime: prev.resendTime - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [state.resendTime]);

  // Handle escape key and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !state.isSubmitting) {
        resetForm();
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose, resetForm, state.isSubmitting]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="fixed inset-0"
        onClick={handleOverlayClick}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80" />

        {/* Header */}
        <div className="relative px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {state.step === "otp" && (
                <button
                  onClick={() => setState(prev => ({ ...prev, step: "mobile" }))}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-white ${state.step === "mobile"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-green-500 to-green-600"
                  }`}>
                  {state.step === "mobile" ? <Phone className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {state.step === "mobile" ? "Welcome Back" : "Enter OTP"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {state.step === "mobile" ? "Sign in to continue" : "Check your messages"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (!state.isSubmitting) {
                  resetForm();
                  onClose();
                }
              }}
              disabled={state.isSubmitting}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 py-6">
          <div className="space-y-6">
            {state.step === "mobile" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <span className="flex items-center justify-center w-16 h-full text-sm font-semibold text-gray-600 bg-gray-50 rounded-l-xl border-r border-gray-200">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      value={state.mobileNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      maxLength="10"
                      placeholder="Enter 10-digit number"
                      className="w-full pl-16 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      required
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the 4-digit code sent to
                    <br />
                    <span className="font-bold text-gray-900">
                      +91 {state.mobileNumber}
                    </span>
                  </p>

                  <div className="flex justify-center space-x-3 mb-6">
                    {state.otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpInputRefs.current[index] = { current: el }}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={() => sendOTP(true)}
                      disabled={state.resendTime > 0 || state.isSubmitting}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>
                        {state.resendTime > 0 ? `Resend in ${state.resendTime}s` : 'Resend OTP'}
                      </span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      <span>Expires in 5 min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {state.error && (
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">
                  {state.error}
                </p>
              </div>
            )}

            {state.successMessage && (
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-green-50 border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 font-medium">
                  {state.successMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={state.isSubmitting}
              className={`w-full py-3 px-6 rounded-xl text-base font-semibold text-white transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${state.isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                }`}
            >
              {state.isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{state.step === "mobile" ? "Sending..." : "Verifying..."}</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  {state.step === "mobile" ? <Phone className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                  <span>{state.step === "mobile" ? "Send OTP" : "Verify & Login"}</span>
                </span>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3 text-green-500" />
              <span>Your data is secured and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;