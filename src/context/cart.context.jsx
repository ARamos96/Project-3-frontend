// src/context/auth.context.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = React.createContext();

function CartProviderWrapper(props) {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage if it exists
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (product) => {
    // Log the product to be added
    console.log("This is the product:", product);

    // Update the cart state with the new product
    setCart((prevCart) => {
      const newCart = [...prevCart, product];

      // Update localStorage with the new cart
      localStorage.setItem("cart", JSON.stringify(newCart));

      // Log the new cart
      console.log("This is the new cart:", newCart);

      // Return the new cart state
      return newCart;
    });

    // Navigate to the cart page
    navigate(`/cart`);
  };

  const buyCart = () => {
    // Log the product to be added
    alert(
      "You just spent:" +
        cart.reduce((a, b) => a + b.price, 0).toFixed(2) +
        " euros"
    );

    // Update the cart state
    setCart([]);

    // Navigate to the cart page
    navigate(`/`);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        buyCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export { CartProviderWrapper, CartContext };
