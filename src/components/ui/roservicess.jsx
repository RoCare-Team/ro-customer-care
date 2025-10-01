"use client"
import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Building2,
  Droplets,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Users,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  ChevronRight,
  Award,
  ArrowLeft,
  ChevronDown,
  Zap,
  Heart,
  Home,
  Briefcase,
  Navigation,
  Edit3,
  Check,
  Trash2
} from 'lucide-react';

const OurServices2 = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedApiServices, setSelectedApiServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    area: '',
    address: '',
    landmark: '',
    pincode: ''
  });
  const [animateCard, setAnimateCard] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('');
  const [expandedServices, setExpandedServices] = useState([]);

  // Sample addresses
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      type: 'home',
      area: 'Sector 21',
      address: 'A-105, Manesar, Gurugram',
      landmark: 'Near City Mall',
      pincode: '122051'
    },
    {
      id: 2,
      type: 'work',
      area: 'IMT Manesar',
      address: 'Plot 45, IMT Industrial Area',
      landmark: 'Opposite Hero MotoCorp',
      pincode: '122052'
    }
  ]);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setModalAnimation('modal-enter');
      setTimeout(() => setModalAnimation('modal-enter-active'), 10);
    } else {
      setModalAnimation('modal-exit');
    }
  }, [isModalOpen]);

  const roService = async () => {
    setLoading(true);
    let lead_type = 1;

    setTimeout(() => {
      if (lead_type !== null) {
        fetch('https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ lead_type: "1" })
        })
          .then(res => res.json())
          .then(data => {
            setServiceData(data.service_details);
            setCategoryTitle(data.Title);
          })
          .catch(error => {
            console.error('Error fetching services:', error);
          });
      }
      setLoading(false);
    }, 1000);
  };

  const services = [
    {
      id: 1,
      title: "Water Purifier Service",
      subtitle: "Keep your water pure & healthy",
      description: "Professional maintenance and repair services for all types of water purifiers with genuine spare parts.",
      icon: Wrench,
      bgGradient: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      buttonColor: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600",
      price: 599,
      originalPrice: 999,
      discount: "40% OFF",
      rating: 4.8,
      reviews: 2341,
      duration: "45-60 mins",
      popular: true,
      features: [
        "Deep cleaning of filters",
        "UV lamp replacement",
        "Tank sanitization",
        "Free water quality test"
      ],
      badge: "Most Booked"
    },
    {
      id: 2,
      title: "RO Plant Service",
      subtitle: "Industrial grade maintenance",
      description: "Complete industrial RO plant maintenance, installation and AMC services for commercial establishments.",
      icon: Building2,
      bgGradient: "from-emerald-500 to-green-400",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      buttonColor: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600",
      price: 1299,
      originalPrice: 1999,
      discount: "35% OFF",
      rating: 4.9,
      reviews: 1856,
      duration: "2-3 hours",
      features: [
        "Complete system check",
        "Membrane cleaning",
        "Pressure optimization",
        "Performance report"
      ],
      badge: "Premium"
    },
    {
      id: 3,
      title: "Water Softener Service",
      subtitle: "Say goodbye to hard water",
      description: "Expert water softener installation, maintenance and salt refilling services for homes and offices.",
      icon: Droplets,
      bgGradient: "from-purple-500 to-pink-400",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      buttonColor: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600",
      price: 899,
      originalPrice: 1499,
      discount: "40% OFF",
      rating: 4.7,
      reviews: 1523,
      duration: "1-2 hours",
      features: [
        "Resin bed cleaning",
        "Salt level check",
        "Valve adjustment",
        "Water hardness test"
      ],
      badge: "Trending"
    }
  ];

  {/* api time slots */ }

  const selectedTimeSlots = async (selectedDate) => {
    console.log(JSON.stringify(selectedDate));
    const payload = { date: selectedDate };
    // console.log(JSON.stringify(payload));

    const res = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/time_slot.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const openModal = (service) => {
    setSelectedService(service);
    setSelectedApiServices([]);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedAddress(savedAddresses[0] || null);
    setCurrentStep(1);
    setIsModalOpen(true);
    setExpandedServices([]);
    roService();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
      setSelectedApiServices([]);
      setCurrentStep(1);
      setServiceData([]);
      setShowAddressForm(false);
      setExpandedServices([]);
    }, 300);
  };

  const handleApiServiceToggle = (apiService) => {
    const existingIndex = selectedApiServices.findIndex(s => s.id === apiService.id);

    if (existingIndex !== -1) {
      // Remove if already selected
      setSelectedApiServices(selectedApiServices.filter(s => s.id !== apiService.id));
    } else {
      // Add with initial quantity
      setSelectedApiServices([...selectedApiServices, { ...apiService, quantity: 1 }]);
    }
  };

  const updateServiceQuantity = (serviceId, delta) => {
    setSelectedApiServices(selectedApiServices.map(service =>
      service.id === serviceId
        ? { ...service, quantity: Math.max(1, service.quantity + delta) }
        : service
    ));
  };

  const removeService = (serviceId) => {
    setSelectedApiServices(selectedApiServices.filter(s => s.id !== serviceId));
  };

  const getTotalPrice = () => {
    return selectedApiServices.reduce((total, service) =>
      total + (service.price * service.quantity), 0
    );
  };

  const getTotalOriginalPrice = () => {
    return selectedApiServices.reduce((total, service) =>
      total + (service.price_without_discount * service.quantity), 0
    );
  };

  const handleProceedToDetails = () => {
    if (selectedApiServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    setCurrentStep(2);
  };

  const handleBackToServices = () => {
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleAddAddress = () => {
    if (newAddress.area && newAddress.address && newAddress.pincode) {
      const newId = Math.max(...savedAddresses.map(addr => addr.id), 0) + 1;
      const addressToAdd = { ...newAddress, id: newId };
      setSavedAddresses([...savedAddresses, addressToAdd]);
      setSelectedAddress(addressToAdd);
      setShowAddressForm(false);
      setNewAddress({
        type: 'home',
        area: '',
        address: '',
        landmark: '',
        pincode: ''
      });
    }
  };

  const handleCheckout = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time for the service');
      return;
    }
    if (selectedApiServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    if (!selectedAddress) {
      alert('Please select an address');
      return;
    }

    const serviceNames = selectedApiServices.map(s => `${s.service_name} (x${s.quantity})`).join(', ');
    alert(`Services booked: ${serviceNames}\nTotal: ₹${getTotalPrice()}\nDate: ${selectedDate} at ${selectedTime}\nAddress: ${selectedAddress.address}`);
    closeModal();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow.toISOString().split('T')[0];
  };

  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('repair')) return Wrench;
    if (name.includes('installation')) return Building2;
    if (name.includes('amc') || name.includes('plan')) return Shield;
    if (name.includes('service')) return CheckCircle;
    return Wrench;
  };

  const getServiceColor = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('repair')) return 'text-red-600';
    if (name.includes('installation')) return 'text-green-600';
    if (name.includes('amc') || name.includes('plan')) return 'text-purple-600';
    if (name.includes('service')) return 'text-blue-600';
    return 'text-gray-600';
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

  return (
    <>
      <section className="py-6 md:py-16 px-3 md:px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center justify-center mb-3 md:mb-4">
              <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-yellow-500 mr-2" />
              <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Professional Services
              </span>
              <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-yellow-500 ml-2" />
            </div>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Services That Care
            </h2>
            <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4">
              Trusted by 50,000+ happy customers. Get expert service at your doorstep.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className={`relative bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform ${animateCard ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    animation: animateCard ? `slideUp 0.6s ease-out ${index * 0.1}s` : 'none'
                  }}
                >
                  {/* Badge */}
                  {service.badge && (
                    <div className={`absolute top-3 right-3 md:top-4 md:right-4 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white bg-gradient-to-r ${service.bgGradient} z-10`}>
                      {service.badge}
                    </div>
                  )}

                  {/* Gradient Header */}
                  <div className={`h-1.5 md:h-2 bg-gradient-to-r ${service.bgGradient}`}></div>

                  <div className="p-4 md:p-8">
                    {/* Icon and Rating */}
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className={`${service.iconBg} w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${service.iconColor}`} />
                      </div>
                      <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 md:w-4 h-3 md:h-4 text-green-600 fill-current" />
                        <span className="text-xs md:text-sm font-semibold text-green-700">{service.rating}</span>
                        <span className="text-[10px] md:text-xs text-gray-600">({service.reviews})</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-base md:text-2xl font-bold text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-3">{service.subtitle}</p>
                    <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-1">
                      {service.description}
                    </p>

                    {/* Features - Hide on mobile */}
                    <div className="hidden md:block space-y-2 mb-6">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Duration */}
                    <div className="flex items-center space-x-2 mb-2 md:mb-4">
                      <Clock className="w-3 md:w-4 h-3 md:h-4 text-gray-400" />
                      <span className="text-xs md:text-sm text-gray-600">{service.duration}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3 md:mb-6">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <span className="text-sm md:text-base font-bold text-gray-900">₹{service.price}</span>
                        <span className="text-xs md:text-sm text-gray-400 line-through">₹{service.originalPrice}</span>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[10px] md:text-sm font-bold px-2 py-1 rounded-lg">
                        {service.discount}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => openModal(service)}
                      className={`w-full ${service.buttonColor} text-white font-semibold py-2.5 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group text-sm md:text-base`}
                    >
                      <span>Book Now</span>
                      <ChevronRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Modal */}
      {isModalOpen && selectedService && (
        <div className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-md transition-all duration-300 ${modalAnimation}`}>
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full mx-2 md:mx-4 transform transition-all duration-500 max-h-[90vh] md:max-h-[95vh] overflow-y-auto modal-content">

            {/* Modal Header */}
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">

              {/* <button className='rounded-md bg-purple-200'  onClick={selectedTimeSlots(selectedDate)}>chekc the date slots</button> */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-6">
                  {/* Step Indicator */}
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
                // Step 1: Service Selection with Multi-select
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      {categoryTitle || selectedService.title}
                    </h4>
                    <p className="text-sm md:text-base text-gray-600">Select services you need</p>
                    {selectedApiServices.length > 0 && (
                      <div className="mt-2 inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                        {selectedApiServices.length} service{selectedApiServices.length > 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="relative">
                        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium text-sm md:text-base">Loading services...</p>
                    </div>
                  ) : serviceData.length > 0 ? (
                    <>
                      {/* Selected Services - Fixed at Top */}
                      {selectedApiServices.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-3">Selected Services</h5>
                          <div className="space-y-2">
                            {selectedApiServices.map((selectedServiceItem) => (
                              <div
                                key={selectedServiceItem.id}
                                className="group relative p-2 md:p-4 border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl transition-all duration-300 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 md:space-x-3 flex-1">
                                    <div className={`${getServiceBg(selectedServiceItem.service_name)} w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                                      <img src={selectedServiceItem.image} alt={selectedServiceItem.service_name} className='w-10 h-10 md:w-10 md:h-10 rounded-lg' />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-bold text-gray-900 text-sm md:text-lg mb-1">
                                        {selectedServiceItem.service_name}
                                      </h5>
                                      <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                          <span className="font-bold text-gray-900">₹{selectedServiceItem.price}</span>
                                          <span className="text-gray-500 line-through">₹{selectedServiceItem.price_without_discount}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Quantity controls and remove button */}
                                  <div className="flex items-center space-x-2 md:space-x-3">
                                    <div className="flex items-center space-x-1 md:space-x-2 bg-white rounded-lg px-2 py-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateServiceQuantity(selectedServiceItem.id, -1);
                                        }}
                                        className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
                                      >
                                        <Minus className="w-3 md:w-4 h-3 md:h-4" />
                                      </button>
                                      <span className="w-6 md:w-8 text-center font-bold text-sm md:text-base">{selectedServiceItem.quantity}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateServiceQuantity(selectedServiceItem.id, 1);
                                        }}
                                        className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all"
                                      >
                                        <Plus className="w-3 md:w-4 h-3 md:h-4" />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => removeService(selectedServiceItem.id)}
                                      className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
                                    >
                                      <X className="w-3 md:w-4 h-3 md:h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Available Services - Vertical Scroll */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-3">
                          {selectedApiServices.length > 0 ? 'Add More Services' : 'Available Services'}
                        </h5>

                        {selectedApiServices.length > 0 ? (
                          /* Improved Add More Services Section */
                          <div className="space-y-3">
                            {/* Available services as cards when some are selected */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                              {serviceData
                                .filter(apiService => !selectedApiServices.some(s => s.id === apiService.id))
                                .map((apiService) => (
                                  <div
                                    key={apiService.id}
                                    onClick={() => handleApiServiceToggle(apiService)}
                                    className="group relative p-3 border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-300"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className={`${getServiceBg(apiService.service_name)} w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                                        <img src={apiService.image} alt={apiService.service_name} className='w-8 h-8 rounded' />
                                      </div>
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900 text-xs mb-1">
                                          {apiService.service_name}
                                        </h6>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                                          <span className="font-bold text-gray-900">₹{apiService.price}</span>
                                          <span className="text-gray-500 line-through">₹{apiService.price_without_discount}</span>
                                        </div>
                                      </div>

                                      {/* Add button */}
                                      <div className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                                        <Plus className="w-3 h-3" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {/* Show message if no more services available */}
                            {serviceData.filter(apiService => !selectedApiServices.some(s => s.id === apiService.id)).length === 0 && (
                              <div className="text-center py-4 bg-gray-50 rounded-xl">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">All available services have been selected</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Vertical scrollable list for Available Services */
                          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                            {serviceData.map((apiService) => (
                              <div
                                key={apiService.id}
                                onClick={() => handleApiServiceToggle(apiService)}
                                className="group relative p-3 md:p-4 border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 w-full"
                              >
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className={`${getServiceBg(apiService.service_name)} w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                                    <img src={apiService.image} alt={apiService.service_name} className='w-10 h-10 md:w-10 md:h-10 rounded-lg' />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-900 text-sm md:text-base mb-1">
                                      {apiService.service_name}
                                    </h5>
                                    <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                                      <div className="flex items-center space-x-1">
                                        <span className="font-bold text-gray-900">₹{apiService.price}</span>
                                        <span className="text-gray-500 line-through">₹{apiService.price_without_discount}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Add button */}
                                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                                    <Plus className="w-4 md:w-5 h-4 md:h-5" />
                                  </div>
                                </div>
                              </div>
                            ))}
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
                                    onClick={() => removeService(service.id)}
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
                                  <span className="text-xs md:text-sm text-gray-500 line-through">₹{getTotalOriginalPrice()}</span>
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
                        onClick={roService}
                        className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Step 2: Booking Details
                <div className="space-y-4 md:space-y-6">
                  {/* Back Button */}
                  <button
                    onClick={handleBackToServices}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 text-sm md:text-base"
                  >
                    <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
                    <span>Back to services</span>
                  </button>

                  {/* Selected Services Summary */}
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">Selected Services</h4>
                    <div className="space-y-2">
                      {selectedApiServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between bg-white rounded-lg p-2 md:p-3">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className={`${getServiceBg(service.service_name)} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center`}>
                              <img src={service.image} alt={service.service_name} className='w-6 h-6 md:w-8 md:h-8 rounded' />
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

                  {/* Date & Time Selection */}
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
                          min={getTomorrowDate()}
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
                            className="w-full p-2.5 md:p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-700 font-medium appearance-none bg-white text-sm md:text-base"
                          >
                            <option value="">Choose time slot</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Selection */}
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

                    {/* Saved Addresses */}
                    <div className="space-y-2 md:space-y-3 mb-4">
                      {savedAddresses.map((address) => {
                        const AddressIcon = getAddressIcon(address.type);
                        return (
                          <div
                            key={address.id}
                            onClick={() => setSelectedAddress(address)}
                            className={`p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${selectedAddress?.id === address.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex items-start space-x-2 md:space-x-3">
                              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${address.type === 'home' ? 'bg-green-100' : address.type === 'work' ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                <AddressIcon className={`w-4 md:w-5 h-4 md:h-5 ${address.type === 'home' ? 'text-green-600' : address.type === 'work' ? 'text-blue-600' : 'text-gray-600'
                                  }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-bold text-gray-900 capitalize text-sm md:text-base">{address.type}</span>
                                  <span className="text-xs md:text-sm text-gray-500">•</span>
                                  <span className="text-xs md:text-sm font-medium text-gray-700">{address.area}</span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mb-1">{address.address}</p>
                                {address.landmark && (
                                  <p className="text-[10px] md:text-xs text-gray-500">Near {address.landmark}</p>
                                )}
                                <p className="text-[10px] md:text-xs font-medium text-gray-700 mt-1">PIN: {address.pincode}</p>
                              </div>
                              {selectedAddress?.id === address.id && (
                                <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add New Address Form */}
                    {showAddressForm && (
                      <div className="border-t border-gray-200 pt-3 md:pt-4 space-y-3 md:space-y-4">
                        <h6 className="font-bold text-gray-900 text-sm md:text-base">Add New Address</h6>

                        <div className="flex space-x-2 md:space-x-3">
                          {['home', 'work', 'other'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setNewAddress({ ...newAddress, type })}
                              className={`flex-1 py-1.5 md:py-2 px-3 md:px-4 rounded-lg md:rounded-xl font-medium transition-all duration-300 capitalize text-xs md:text-sm ${newAddress.type === type
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <input
                            type="text"
                            placeholder="Area/Locality"
                            value={newAddress.area}
                            onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                            className="p-2 md:p-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
                          />
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            className="p-2 md:p-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Complete Address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full p-2 md:p-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
                        />

                        <input
                          type="text"
                          placeholder="Landmark (optional)"
                          value={newAddress.landmark}
                          onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          className="w-full p-2 md:p-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
                        />

                        <div className="flex space-x-2 md:space-x-3">
                          <button
                            onClick={() => setShowAddressForm(false)}
                            className="flex-1 py-2 md:py-3 bg-gray-100 text-gray-600 rounded-lg md:rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm md:text-base"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddAddress}
                            className="flex-1 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg md:rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-300 text-sm md:text-base"
                          >
                            Save Address
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trust Badges - Hide on mobile for space */}
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

                  {/* Checkout Button */}
                  <div className="sticky bottom-0 bg-white pt-3 md:pt-4 border-t border-gray-100">
                    <button
                      onClick={handleCheckout}
                      disabled={!selectedDate || !selectedTime || !selectedAddress}
                      className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 font-bold text-sm md:text-lg flex items-center justify-center space-x-2 md:space-x-3 transform hover:scale-105 shadow-lg ${selectedDate && selectedTime && selectedAddress
                          ? `${selectedService.buttonColor} text-white hover:shadow-2xl`
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

export default OurServices2;