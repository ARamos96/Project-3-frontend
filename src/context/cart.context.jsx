// src/context/auth.context.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = React.createContext();

function CartProviderWrapper(props) {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [badge, setBadge] = useState(0);

  useEffect(() => {
    // Load cart from localStorage if it exists
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Add dish object, including duplicates
  const addToCart = (dish) => {
    // Log the product to be added
    console.log("This is the product: ", JSON.stringify(dish));

    if (isCartFull()) {
      alert("You have reached the maximum number of dishes per week");
      return;
    } else {
      // Update the cart state with the new dish
      setCart((prevCart) => {
        const newCart = [...prevCart, dish];

        // Update localStorage with the new cart
        localStorage.setItem("cart", JSON.stringify(newCart));

        // Log the new cart
        console.log("This is the new cart:", newCart);

        // Update badge
        updateBadge(newCart.length);

        // Return the new cart state
        return newCart;
      });
    }
  };

  // Limit of total dishes, including duplicates, is set in mealplan.dishesPerWeek
  const isCartFull = () => {
    return cart.length === getMealPlan().dishesPerWeek;
  };

  // Remove dish from cart state and local storage
  const removeFromCart = (dish) => {
    // Update the cart state, removing the provided dish
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== dish.id);

      // Update localStorage with the new cart
      localStorage.setItem("cart", JSON.stringify(newCart));

      // Update badge
      updateBadge(newCart.length);

      return newCart;
    });
  };

  // Update count on badge, after adding or removing a dish
  const updateBadge = (count) => {
    if (count <= 0) {
      setBadge(count + 1);
    } else setBadge(Math.max(count - 1, 0));
  };

  // Count each item in the cart, including duplicates
  const getDishesAndQuantity = () => {
    // Return an array of dishes and their quantities
    return cart.reduce((accumulatorArray, currentDish) => {
      // Check if the currentDish already exists in accumulatorArray
      const foundDish = accumulatorArray.find(
        (itemInCart) => itemInCart._id === currentDish._id
      );
      // If so, increase the count of existing dish
      if (foundDish) {
        foundDish.count++;
      } else {
        // Otherwise, add another entry
        accumulatorArray.push({
          _id: currentDish._id,
          name: currentDish.name,
          count: 1,
        });
      }
      return accumulatorArray;
    }, []);
  };

  const checkout = () => {
    // Log the product to be added
    alert(
      "The total is :" +
        cart.reduce((a, b) => a + b.price, 0).toFixed(2) +
        " euros"
    );

    // NAVIGATE TO checkout page
    navigate("/checkout");
  };

  // After posting new mealplan in MealPlan page, save it to local storage
  const setMealPlan = (mealPlan) => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  };

  const getMealPlan = () => {
    const storedMealPlan = localStorage.getItem("mealPlan");
    if (storedMealPlan) {
      return JSON.parse(storedMealPlan);
    } else {
      return null;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        badge,
        setCart,
        addToCart,
        isCartFull,
        removeFromCart,
        emptyCart,
        updateBadge,
        getDishesAndQuantity,
        checkout,
        getMealPlan,
        setMealPlan,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export { CartProviderWrapper, CartContext };
