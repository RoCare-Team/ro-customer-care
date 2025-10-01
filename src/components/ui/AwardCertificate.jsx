"use client";
import Image from "next/image";

const awards = [
  { src: "/award/iso.webp", alt: "ISO Certification" },
  { src: "/award/td.webp", alt: "Trademark Registered" },
  { src: "/award/cum.webp", alt: "Consumer Award" },
  { src: "/award/dungs.jpg", alt: "DUNS Registered" },
];

export default function AwardCertifications() {
  return (
    <section className="bg-white py-8 px-4 mt-12"> {/* ✅ Added margin-top */}
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Awards & Certifications
      </h2>
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
          {awards.map((award, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 flex items-center justify-center w-full h-40"
            >
              <Image
                src={award.src}
                alt={award.alt}
                width={140}
                height={140}
                className="object-contain h-24 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
