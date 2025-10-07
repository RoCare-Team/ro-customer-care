"use client";

import { useEffect, useState } from "react";
import { Wrench, Users, CalendarCheck, MapPin } from "lucide-react";

const milestones = [
  { id: 1, label: "Happy Customer", value: 2500000, icon: Wrench }, // 25 lakh = 2,500,000
  { id: 2, label: "Partner", value: 8500, icon: Users },
  { id: 3, label: "Years of Experience", value: 17, icon: CalendarCheck },
  { id: 4, label: "Cities Served", value: 1400, icon: MapPin },
];


export default function Milestones() {
  const [counts, setCounts] = useState(milestones.map(() => 0));

  useEffect(() => {
    const intervals = milestones.map((m, index) =>
      setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];
          if (updated[index] < m.value) {
            updated[index] += Math.ceil(m.value / 100);
          }
          return updated;
        });
      }, 20)
    );

    return () => intervals.forEach((i) => clearInterval(i));
  }, []);

  return (
    <section className="mx-w-7xl py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {milestones.map((m, index) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon with updated color */}
              <div className="flex justify-center mb-3">
                <Icon className="w-10 h-10 text-blue-600" />
              </div>

              {/* Animated Number */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                {counts[index] > m.value ? m.value : counts[index]}+
              </h3>

              {/* Label */}
              <p className="text-gray-600 mt-1 text-sm md:text-base">{m.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
