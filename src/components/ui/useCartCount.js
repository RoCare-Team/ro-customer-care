
"use client";
import { useState, useEffect } from "react";

const getCartCount = () => {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("checkoutState") || "[]";
    const checkoutState = JSON.parse(raw);

    let totalCount = 0;
    checkoutState.forEach((category) => {
      category.cart_dtls.forEach((item) => {
        totalCount += parseInt(item.quantity || 1);
      });
    });

    return totalCount;
  } catch {
    return 0;
  }
};

export default function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return cartCount;
}
