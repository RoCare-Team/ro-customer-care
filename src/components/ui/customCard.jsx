// components/BookNowCards.js
import { Droplets, Wrench, ShieldCheck } from "lucide-react"; // install with: npm install lucide-react

const services = [
  {
    title: "Water Purifier Installation",
    description: "Quick and professional RO purifier installation for your home or office.",
    icon: Droplets,
  },
  {
    title: "RO Maintenance & Repair",
    description: "Expert maintenance and repairs to keep your water safe and clean.",
    icon: Wrench,
  },
  {
    title: "AMC & Water Quality Check",
    description: "Annual Maintenance Contract and regular water quality testing.",
    icon: ShieldCheck,
  },
];

const BookNowCards = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch p-6 bg-gray-50 rounded-lg shadow-md max-w-7xl mx-auto my-12">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="flex-1 bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-900 rounded-3xl shadow-xl p-10 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-200 mb-6 mx-auto">
              <Icon className="w-8 h-8 text-blue-700" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
              <p className="mb-6 text-gray-700 text-lg leading-relaxed">
                {service.description}
              </p>
              <button className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300">
                Book Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookNowCards;
