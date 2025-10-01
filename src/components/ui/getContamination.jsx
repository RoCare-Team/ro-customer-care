import React from "react"

const brandServices = [
  {
    brand: "Kent RO Service",
    desc: `If you need an immediate response for Kent RO service at your doorstep, visit the nearest Kent service center or search for "Kent RO service near me" to get your service done within 2-4 hours. Kent water purifiers are designed to tackle all kinds of infections, whether from salts or microbes. To book your Kent RO service, visit the service center or call the Kent customer care number. Kent is known for manufacturing high-quality water purifiers and providing reliable service.`,
  },
  {
    brand: "Livpure Service Center",
    desc: `Hiring a Livpure customer care service engineer ensures your water purifier receives proper treatment from skilled professionals. Livpure is among the top water purifier providers, known for transparent and high-quality service. You can book a service via phone, SMS, website, or email, and their engineer will reach your doorstep within 24 hours.`,
  },
  {
    brand: "Pureit Service",
    desc: `To get your Pureit water purifier serviced, look for the nearest Pureit customer care store. Pureit is dedicated to customer satisfaction and offers service booking via phone, SMS, or email, with customer care available 24/7. Pureit is known for providing top-quality services at a comparatively lower cost.`,
  },
  {
    brand: "Other Leading Brands",
    desc: `There are many other water purifier service providers such as Aquafresh, Tata Swach, Zero B, Aquagrand, Aquasure, Nasaka, and more. For these brands, you can call the certified service center and arrange your water purifier service for safe and clear drinking water.`,
  },
];

const GetContamination = () => (
  <section className="w-full py-14 px-2 md:px-0 bg-gradient-to-br from-blue-50 to-white">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 text-center">
        Water Purifier Service
      </h1>
      <div className="text-center text-lg text-blue-700 font-medium mb-8">
        Get Contamination Free Water At Your Doorstep
      </div>
      <div className="space-y-6 mb-10">
        {brandServices.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500 hover:border-blue-700 transition"
          >
            <h3 className="text-lg font-bold text-blue-700 mb-2">{item.brand}</h3>
            <p className="text-gray-700">{item.desc}</p>
          </div>
        ))}
      </div>

      

      <div className="bg-blue-100 rounded-xl shadow p-6 mt-8 text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Drink Safe, Stay Healthy</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Drinking water is essential for all body functions, but only if it is pure. Book your water purifier service today and enjoy contamination-free water for your family’s health and safety.
        </p>
        <a
          href="/contact"
          className="inline-block mt-6 px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition"
        >
          Book Service Now
        </a>
      </div>
    </div>
  </section>
);

export default GetContamination;