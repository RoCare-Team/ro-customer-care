"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    MdPerson,
    MdEmail,
    MdPhone,
    MdEdit,
    MdSave,
    MdClose,
    MdSecurity,
    MdCheck,
    MdCameraAlt,
    MdDelete,
    MdImage,
    MdInfo,
    MdWarning,
    MdError,
    MdCheckCircle,
    MdLogout
} from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AccountDetails = () => {
    const router = useRouter();
    const [user, setUser] = useState({ name: "", email: "", mobile: "", profileImage: "" });
    const [formData, setFormData] = useState({ name: "", email: "", profileImage: "" });
    const [errors, setErrors] = useState({ name: "", email: "", image: "" });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState("update"); // 'update' or 'logout'
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success"); // 'success', 'error', 'info', 'warning'
    const fileInputRef = useRef(null);



    useEffect(() => {
        const fetchUser = () => {
            try {
                const localData = {
                    name: localStorage.getItem("userName") || "",
                    email: localStorage.getItem("userEmail") || "",
                    mobile: localStorage.getItem("userPhone") || "",
                    profileImage: localStorage.getItem("userProfileImage") || "",
                };

                const customerId = localStorage.getItem("customer_id");
                if (!customerId) {
                    router.push("/");
                    showAlert("Please login to access your account", "info");
                    return;
                }

                const urlParams = new URLSearchParams(window.location.search);
                const otpVerified = urlParams.get('otp_verified');

                if (otpVerified === 'true') {
                    showAlert("Mobile number verified successfully", "success");
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                setUser(localData);
                setFormData({
                    name: localData.name,
                    email: localData.email,
                    profileImage: localData.profileImage
                });
                setImagePreview(localData.profileImage);
            } catch (error) {
                showAlert("Failed to load user data", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const showAlert = (message, type = "success") => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, image: "Please select a valid image file (JPEG, PNG, WebP, or GIF)" }));
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
            return;
        }
        setUploadingImage(true);
        setErrors(prev => ({ ...prev, image: "" }));
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                setImagePreview(base64String);
                setFormData(prev => ({ ...prev, profileImage: base64String }));
            };
            reader.readAsDataURL(file);
        } catch (error) {
            setErrors(prev => ({ ...prev, image: "Failed to process image" }));
            showAlert("Failed to process image", "error");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview("");
        setFormData(prev => ({ ...prev, profileImage: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validate = () => {
        let valid = true;
        const newErrors = { name: "", email: "", image: "" };

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            valid = false;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const hasChanges = () =>
        formData.name.trim() !== user.name.trim() ||
        formData.email.trim() !== user.email.trim() ||
        formData.profileImage !== user.profileImage;

    const handleSubmit = async () => {
        if (!validate()) return;
        if (!hasChanges()) {
            showAlert("No changes to update", "info");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                customer_id: localStorage.getItem("customer_id") || "",
                name: formData.name.trim(),
                email: formData.email.trim(),
                phoneNumber: localStorage.getItem("userPhone") || user.mobile || "",
                profileImage: formData.profileImage,
            };

            const res = await fetch(
                "https://waterpurifierservicecenter.in/customer/ro_customer/update_user_dtls.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();
            if (!data.error) {
                localStorage.setItem("userName", payload.name);
                localStorage.setItem("userEmail", payload.email);
                localStorage.setItem("userProfileImage", payload.profileImage);

                setUser({
                    ...user,
                    name: payload.name,
                    email: payload.email,
                    profileImage: payload.profileImage
                });
                showAlert("Profile updated successfully", "success");
                setIsEditing(false);
            } else {
                showAlert(data.msg || "Failed to update profile", "error");
            }
        } catch (error) {
            showAlert("Update failed: " + (error.message || "Unknown error"), "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
        });
        setImagePreview(user.profileImage);
        setErrors({ name: "", email: "", image: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
        showAlert("You have been logged out successfully", "success");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Alert component colors
    const alertColors = {
        success: "bg-green-100 text-green-800 border-green-200",
        error: "bg-red-100 text-red-800 border-red-200",
        warning: "bg-amber-100 text-amber-800 border-amber-200",
        info: "bg-blue-100 text-blue-800 border-blue-200"
    };

    const alertIcons = {
        success: <MdCheckCircle className="w-5 h-5" />,
        error: <MdError className="w-5 h-5" />,
        warning: <MdWarning className="w-5 h-5" />,
        info: <MdInfo className="w-5 h-5" />
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:mt-10">
                <div className="max-w-2xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-6 sm:mb-8 relative">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0066FF] rounded-full mb-3 sm:mb-4 shadow-lg">
                            <MdPerson className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-10 sm:mt-0">
                            Account Details
                        </h1>
                        <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your personal information</p>

                        {/* Mobile-only Logout Button */}

                    </div>

                    {/* Main Card */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
                        <div className="sm:hidden absolute top-5 right-5">
                            <button
                                onClick={() => {
                                    setConfirmAction("logout");
                                    setConfirmOpen(true);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 text-sm relative z-50"
                            >
                                <MdLogout className="w-4 h-4" />
                                <span className="font-medium">Logout</span>

                            </button>
                        </div>
                        <div className="relative z-10">
                            {/* Profile Picture Section */}
                            <div className="flex justify-center mb-8">
                                <div className="relative group">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                                        {imagePreview ? (
                                            <Image
                                                src={imagePreview}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">
                                                    {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                                                </span>
                                            </div>
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <MdCameraAlt className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                        <MdCheck className="w-4 h-4 text-white" />
                                    </div>

                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {uploadingImage ? (
                                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <MdEdit className="w-3 h-3 text-white" />
                                            )}
                                        </button>
                                    )}

                                    {isEditing && imagePreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-colors duration-200"
                                        >
                                            <MdClose className="w-3 h-3 text-white" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {isEditing && (
                                <div className="flex justify-center mb-6">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors duration-200 disabled:opacity-50"
                                        >
                                            <MdImage className="w-4 h-4" />
                                            {uploadingImage ? "Uploading..." : "Change Photo"}
                                        </button>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors duration-200"
                                            >
                                                <MdDelete className="w-4 h-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {errors.image && (
                                <div className="flex items-center justify-center gap-2 mb-4 text-red-600 text-sm bg-red-50 rounded-lg p-3">
                                    <MdClose className="w-4 h-4" />
                                    {errors.image}
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-5">
                                {/* Full Name Field */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                        <MdPerson className="w-4 h-4" />
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 ${errors.name
                                                ? "border-red-300 bg-red-50/50"
                                                : isEditing
                                                    ? "border-[#0066FF]/50 hover:border-[#0066FF]"
                                                    : "border-slate-200"
                                                } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && (
                                            <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                                                <MdClose className="w-4 h-4" />
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                        <MdEmail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 ${errors.email
                                                ? "border-red-300 bg-red-50/50"
                                                : isEditing
                                                    ? "border-[#0066FF]/50 hover:border-[#0066FF]"
                                                    : "border-slate-200"
                                                } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                                            placeholder="Enter your email address"
                                        />
                                        {errors.email && (
                                            <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
                                                <MdClose className="w-4 h-4" />
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Field */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                        <MdPhone className="w-4 h-4" />
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={user.mobile || "-"}
                                            disabled
                                            className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed opacity-70"
                                        />
                                        <div className="flex items-center gap-2 mt-1 text-slate-400 text-xs">
                                            <MdSecurity className="w-4 h-4" />
                                            To change phone number, please contact support
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-slate-200/50">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full bg-[#0066FF] text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <MdEdit className="w-5 h-5" />
                                        Edit Profile
                                    </button>

                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                            className="flex-1 bg-white/80 text-slate-700 font-semibold py-4 px-6 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <MdClose className="w-5 h-5" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setConfirmAction("update");
                                                setConfirmOpen(true);
                                            }}
                                            disabled={isSubmitting || !hasChanges() || uploadingImage}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
                                        >
                                            <MdSave className="w-5 h-5" />
                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {confirmOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-100 animate-in">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MdSecurity className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                                    {confirmAction === "update" ? "Confirm Update" : "Confirm Logout"}
                                </h3>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    {confirmAction === "update"
                                        ? "Are you sure you want to update your profile details? This action will save your changes permanently."
                                        : "Are you sure you want to logout? You'll need to login again to access your account."}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setConfirmOpen(false)}
                                        className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setConfirmOpen(false);
                                            if (confirmAction === "update") {
                                                handleSubmit();
                                            } else {
                                                handleLogout();
                                            }
                                        }}
                                        className={`flex-1 bg-gradient-to-r ${confirmAction === "update"
                                            ? "from-blue-500 to-purple-600"
                                            : "from-red-500 to-orange-600"
                                            } text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
                                    >
                                        {confirmAction === "update" ? "Yes, Update" : "Yes, Logout"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alert Notification */}
                {alertOpen && (
                    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md`}>
                        <div
                            className={`flex items-center justify-between p-4 rounded-2xl shadow-lg border ${alertColors[alertType]} transition-all duration-300 animate-in`}
                        >
                            <div className="flex items-center gap-3">
                                {alertIcons[alertType]}
                                <span className="font-medium">{alertMessage}</span>
                            </div>
                            <button
                                onClick={() => setAlertOpen(false)}
                                className="p-1 rounded-full hover:bg-black/10 transition-colors"
                            >
                                <MdClose className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AccountDetails;
