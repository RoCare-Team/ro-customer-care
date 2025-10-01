const features = [
  {
    icon: "🚪",
    title: "Doorstep Service",
    desc: "Technician visits your location for service",
  },
  {
    icon: "⏱️",
    title: "Complete Service in 48 Hours",
    desc: "Guaranteed service visit in 48 hours for your request",
  },
  {
    icon: "🛠️",
    title: "Authorized Technicians",
    desc: "Trained technicians for high quality service and repairs",
  },
  {
    icon: "🔩",
    title: "High Quality Repairs",
    desc: "Only high quality spare parts used for repairs",
  },
];


const DataFound = () =>{
  return (
    <div>DataFound</div>
  )
}
DataFound()

if(DataFound().length === 0){
  console.log("not found")
}
const WhyChooseUs = () => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4 grid md:grid-cols-2 gap-10 items-center">
      {/* Left Side */}
      <div>
        <span className="text-sm text-blue-700 font-semibold tracking-wide">
           Why Choose Us?
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
          The RO Care Difference
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          For years, we've been a trusted service provider, earning and
          maintaining the trust of thousands of customers with our quality and
          commitment.
        </p>
        <div className="flex gap-6">
          <a
            href="tel:1234567890"
            className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
          >
            Call Now <span aria-hidden>→</span>
          </a>
          <a
            href="/contact"
            className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
          >
            Book Free Estimate <span aria-hidden>→</span>
          </a>
        </div>
      </div>
      {/* Right Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-l md:pl-10">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-semibold text-lg text-gray-900">{f.title}</h3>
            </div>
            <p className="text-gray-600 ml-10">{f.desc}</p>
            {i % 2 === 0 && (
              <hr className="my-2 border-gray-200 w-4/5 ml-10" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;