"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How can I book an RO service?",
    answer:
      "You can book an RO service online through our website by selecting your city and preferred service date.",
  },
  
  {
    question: "What services are included in RO maintenance?",
    answer:
      "Our RO maintenance includes filter replacement, membrane check, tank cleaning, and overall system inspection.",
  },
  {
    question: "How long does an RO service take?",
    answer:
      "A typical RO service takes around 45 minutes to 1 hour, depending on the system’s condition.",
  },
  {
    question: "Do I need to be present during the service?",
    answer:
      "Yes, we recommend that someone be present to guide the technician and ensure proper servicing.",
  },
  {
    question: "What if I face an issue after service?",
    answer:
      "If you face any issues after the service, you can contact our customer support within 48 hours for a follow-up.",
  },
];

export default function FaqSectionRO() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700 dark:text-gray-800">
        RO Customer Service FAQs
      </h2>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            layout
            className="border rounded-lg overflow-hidden shadow-sm dark:border-gray-700"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left px-6 py-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 dark:bg-gray-200 dark:hover:bg-gray-300 transition"
            >
              <span className="font-medium text-gray-900 dark:text-gray-800">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold text-gray-900 dark:text-gray-800"
              >
                +
              </motion.span>
            </button>

            {/* Answer */}
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4 bg-white dark:bg-gray-100 text-gray-700 dark:text-gray-800"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
