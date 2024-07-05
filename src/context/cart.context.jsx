// src/context/auth.context.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../services/auth.service";
import { AuthContext } from "./auth.context";
import { showToast } from "../utils/Toast";

const CartContext = React.createContext();

function CartProviderWrapper(props) {
  const navigate = useNavigate();
  const { user, isUserLoaded, checkIfUserDataIsLoaded } =
    useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [badge, setBadge] = useState(0);
  const [mealPlan, setMealPlan] = useState({});
  const [isMealPlanLoaded, setIsMealPlanLoaded] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [hasFetchedRecipes, setHasFetchedRecipes] = useState(false);
  const [isToastDisplayed, setIsToastDisplayed] = useState(false);

  // On user loading, if user has less than 6 fields (just signed up, token payload),
  // load all user data
  useEffect(() => {
    const isMealPlanOrCart = checkSavedCartOrMealPlan();

    if (isMealPlanOrCart.isMealPlan) {
      const storedMealPlan = JSON.parse(localStorage.getItem("mealPlan"));
      setMealPlan(storedMealPlan);
      setIsMealPlanLoaded(true);
    }

    if (isMealPlanOrCart.isCart) {
      const storedCart = JSON.parse(localStorage.getItem("cart"));
      setCart(storedCart);
      setBadge(storedCart.length);
    }
  }, [
    user,
    isUserLoaded,
    checkIfUserDataIsLoaded,
    isMealPlanLoaded,
    setIsMealPlanLoaded,
  ]);

  // On context loading, get dishes from database
  useEffect(() => {
    if (recipes?.length === 0 && !hasFetchedRecipes) {
      fetchRecipes();
    }
  }, [recipes, hasFetchedRecipes]);

  const checkSavedCartOrMealPlan = () => {
    // Initialize flags to false to indicate if a cart or meal plan is saved
    let isCart = false;
    let isMealPlan = false;

    // Retrieve the cart if it exists
    const storedCart = JSON.parse(localStorage.getItem("cart"));

    // Retrieve mealplan if it exists
    const storedMealPlan = JSON.parse(localStorage.getItem("mealPlan"));

    // Check if storedCart is explicitly not null or undefined
    if (storedCart !== null && storedCart !== undefined) {
      isCart = true;
    }
    // Check if storedMealPlan is explicitly not null or undefined
    if (storedMealPlan !== null && storedMealPlan !== undefined) {
      isMealPlan = true;
    }

    return { isCart: isCart, isMealPlan: isMealPlan };
  };

  // Add dish object, including duplicates
  const addToCart = (dish) => {
    // Log the product to be added
    console.log("This is the product: ", JSON.stringify(dish));

    if (isCartFull()) {
      if (!isToastDisplayed) {
        showToast(
          "You have reached the maximum number of dishes per week",
          "warning"
        );
        setIsToastDisplayed(true);

        setTimeout(() => {
          setIsToastDisplayed(false);
        }, 3000); // 3 second timeout to avoid multiple toasts triggered
      }
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
    return cart.length === mealPlan.dishesPerWeek;
  };

  // Remove dish from cart state and local storage
  const removeFromCart = (dish) => {
    // If there is only one dish in cart, empty cart
    if (cart.length === 1 && cart[0]._id === dish._id) {
      emptyCart();
    } else {
      // Update the cart state, removing the provided dish
      setCart((prevCart) => {
        let newCart = prevCart;
        // If there are no multiple units of the same dish
        if (dish.count === 0) {
          newCart = prevCart.filter((item) => item._id !== dish._id);
        } else {
          // Find first instance of dish._id and splice it from prevCart
          const index = prevCart.findIndex((item) => item._id === dish._id);
          newCart = prevCart.toSpliced(index, 1);
        }

        // Update localStorage with the new cart
        localStorage.setItem("cart", JSON.stringify(newCart));

        // Update badge
        updateBadge(newCart.length);

        return newCart;
      });
    }
  };

  // Empty the cart in its state, localStorage and clear badge
  const emptyCart = () => {
    setCart([]);

    localStorage.removeItem("cart");

    updateBadge(0);
  };

  // Delete the mealplan in state, localStorage
  const deleteMealPlan = () => {
    setMealPlan({});
    localStorage.removeItem("mealPlan");
  };

  // Update count on badge, after adding or removing a dish
  const updateBadge = (count) => {
    setBadge(count);
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
          smallImageURL: currentDish.smallImageURL,
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
  const setMealPlanInStateAndStorage = (mealPlan) => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
    setMealPlan(mealPlan);
  };

  const fetchRecipes = async () => {
    try {
      const response = await authService.getDishes();
      setRecipes(response.data);
      setFilteredRecipes(response.data); // Set initial filtered recipes to all recipes
      setHasFetchedRecipes(true);
    } catch (error) {
      showToast(error.data.message, "error");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        badge,
        mealPlan,
        setMealPlan,
        isMealPlanLoaded,
        setCart,
        addToCart,
        isCartFull,
        removeFromCart,
        emptyCart,
        deleteMealPlan,
        updateBadge,
        getDishesAndQuantity,
        checkout,
        setMealPlanInStateAndStorage,
        recipes,
        setRecipes,
        filteredRecipes,
        setFilteredRecipes,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export { CartProviderWrapper, CartContext };
