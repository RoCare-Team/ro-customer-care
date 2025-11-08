// pura checkoutState return karega
export const getCartData = () => {
  if (typeof window === "undefined") return []; // ✅ SSR safety

  try {
    const cartData = localStorage.getItem("checkoutState");
    if (!cartData) return [];

    // Check if it's valid JSON
    if (cartData === "[object Object]") {
      console.warn("Invalid checkoutState in localStorage, resetting...");
      localStorage.removeItem("checkoutState"); // optional
      return [];
    }

    return JSON.parse(cartData);
  } catch (error) {
    console.error("Error parsing cart data:", error);
    return [];
  }
};


// sirf services list flatten karke return karega
export const getCartItems = () => {
  const cartData = getCartData();
  

  if (!Array.isArray(cartData)) return [];

  // cartData → [{ cart_dtls: [...] }, {...}]
  // flatten → [{service_id, quantity, leadtype_name, category_cart_id, total_main}, ...]
  const items = cartData.flatMap(item => {
    if (!item.cart_dtls || !Array.isArray(item.cart_dtls)) return [];
    return item.cart_dtls.map(dtl => ({
      service_id: dtl.service_id,
      quantity: dtl.quantity,
      service_name:dtl.service_name,
      description: dtl.description,
      price:dtl.price,
      total_price: dtl.total_price,
      price_without_discount: dtl.price_without_discount,
      image: dtl.image,
      leadtype_name: item.leadtype_name,
      category_cart_id: item.category_cart_id,
      total_main: item.total_main
    }));
  });

  return items;
};
