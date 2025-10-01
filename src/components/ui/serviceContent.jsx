"use client";
import { useState } from "react";

export default function ROServiceContent({ city }) {
    console.log("city",city);
    
  const [showMore, setShowMore] = useState(false);

  // Split content into preview and full
  const previewContent = (
    <>
      <p className="text-gray-700 leading-relaxed">
        Looking For RO Service? Click And Register It Now!!
      </p>
      <p className="text-gray-700 leading-relaxed">
        We can reach everyone's door within 24 hours; consequently, people can connect us
        for quick response at their premises, and we also assure high-rated water purifier repair
        and maintenance services at comparatively low cost...
      </p>
    </>
  );

  const fullContent = (
    <>
      <p className="text-gray-700 leading-relaxed">
        Our RO service technician is result-oriented and believes in providing quality services
        without failing. They not only propose water purifier servicing but also guide people
        about minor issues in the RO water purifier. Recruiting us as your water purifier technician
        can be the top deal for RO water purifier repair with these privileges...
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        How Water Purifier Service Near Me Works
      </h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Book RO service near me by calling us or filling the enquiry form.</li>
        <li>Get technician confirmation call.</li>
        <li>Schedule your service.</li>
        <li>Technician will visit your place.</li>
        <li>Service completed.</li>
        <li>Make payment and share your valuable feedback.</li>
      </ol>

      {/* You can add the rest of your content here (Kent, Pureit, Livpure sections) */}
    </>
  );

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">
        About Our Water Purifier Services {city}
      </h1>

      {/* Show preview content always */}
      {previewContent}

      {/* Toggleable full content */}
      {showMore && fullContent}

      {/* Show More / Show Less button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    </section>
  );
}
