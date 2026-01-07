import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cartAPI from "../api/cart.api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const isAuthenticated = useSelector(
    (state) => state.userAuth.isAuthenticated
  );

  const normalizeCartItem = (item) => {
    const productSize = item.productSize ?? item;
    const product = productSize.product ?? item.product;

    return {
      key: String(productSize.id),
      productSizeId: productSize.id,
      quantity: item.quantity ?? 1,
      size: productSize.size,
      product,
    };
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem("cart");
      if (stored) setCart(JSON.parse(stored));
      setInitialized(true);
    }
  }, [isAuthenticated]);

useEffect(() => {
  const syncCartWhenLogin = async () => {
    if (!isAuthenticated) return;

    let localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const validItems = localCart.filter((item) => item.productSizeId);

    if (validItems.length !== localCart.length) {
      localStorage.setItem("cart", JSON.stringify(validItems));
    }

    for (const item of validItems) {
      await cartAPI.addToCart({
        productSizeId: item.productSizeId,
        quantity: item.quantity,
      });
    }

    localStorage.removeItem("cart");

    const res = await cartAPI.getCart();
    setCart(res.data.items.map(normalizeCartItem));
  };

  syncCartWhenLogin();
}, [isAuthenticated]);


  useEffect(() => {
    if (!isAuthenticated && initialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, initialized]);

  const addToCart = async (productSize, quantity = 1) => {
      if (!productSize?.id) {
        throw new Error("productSizeId missing !");
      }
    const key = String(productSize.id);

    if (!isAuthenticated) {
      setCart((prev) => {
        const exist = prev.find((i) => i.key === key);

        const newCart = exist
          ? prev.map((i) =>
              i.key === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [
              ...prev,
              {
                key,
                productSizeId: productSize.id,
                quantity,
                size: productSize.size,
                product: productSize.product,
              },
            ];

        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    } else {
      await cartAPI.addToCart({
        productSizeId: productSize.id,
        quantity,
      });

      const res = await cartAPI.getCart();
      setCart(res.data.items.map(normalizeCartItem));
    }

    setShowCartPopup(true);
  };
 const removeFromCart = async (productSizeId) => {
  if (!productSizeId) return;

  if (!isAuthenticated) {
    setCart((prev) => {
      const newCart = prev.filter((i) => i.key !== String(productSizeId));
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  } else {
  await cartAPI.removeCartItem(productSizeId);  
    const res = await cartAPI.getCart();
    setCart(res.data.items.map(normalizeCartItem));
  }
};

  const updateQuantity = async (key, quantity) => {
    if (quantity < 1) return;

    if (!isAuthenticated) {
      setCart((prev) => {
        const newCart = prev.map((i) =>
          i.key === key ? { ...i, quantity } : i
        );
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    } else {
      await cartAPI.updateCartItem({
        productSizeId: key,
        quantity,
      });

      const res = await cartAPI.getCart();
      setCart(res.data.items.map(normalizeCartItem));
    }
  };

  const clearCart = async () => {
  if (!isAuthenticated) {
    setCart([]);
    localStorage.removeItem("cart");
  } else {
    await cartAPI.clearCart();
    setCart([]);
  }
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        showCartPopup,
        setShowCartPopup,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
