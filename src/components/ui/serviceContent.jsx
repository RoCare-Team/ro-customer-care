"use client";
import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

export default function ROServiceContent({ pageData }) {
  const [safeHTML, setSafeHTML] = useState("");

  useEffect(() => {
    if (pageData?.content_text) {
      const clean = DOMPurify.sanitize(pageData.content_text);
      setSafeHTML(clean);
    }
  }, [pageData]);

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">
        {pageData?.page_title}
      </h1>

      {safeHTML ? (
        <p
          className="text-justify text-gray-700 dark:text-gray-800"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      ) : (
        <p className="text-gray-400"></p>
      )}
    </section>
  );
}
