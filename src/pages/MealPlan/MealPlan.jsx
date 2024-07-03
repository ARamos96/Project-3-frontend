import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel";
import "./MealPlan.css";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import { showToast } from "../../utils/Toast.js";
import { validateMealPlan } from "../../utils/DataValidation.js";

function MealPlan() {
  const [numPeople, setNumPeople] = useState(0);
  const [numDishes, setNumDishes] = useState(0);
  const [diet, setDiet] = useState([]);
  const [price, setPrice] = useState(0);
  const [isUserAlerted, setIsUserAlerted] = useState(false);
  const { user, isActiveSubscriptionInUser, getSubscriptionReorderDate } =
    useContext(AuthContext);
  const { setMealPlanInStateAndStorage, mealPlan, isMealPlanLoaded } =
    useContext(CartContext);
  const navigate = useNavigate();
  const [isMealPlanInComponent, setIsMealPlanInComponent] = useState(false);

  useEffect(() => {
    if (isActiveSubscriptionInUser() && !isUserAlerted) {
      const reorderDate = getSubscriptionReorderDate(
        user.activeSubscription.createdAt
      );

      showToast(
        `You already have an active subscription. You can start a new one on ${reorderDate} `,
        "error"
      );
      setIsUserAlerted(true);

      setTimeout(() => {
        navigate("/profile");
      }, 1000);

      return;
    } else if (isMealPlanLoaded && !isMealPlanInComponent) {
      setNumPeople(mealPlan.numberOfPeople);
      setNumDishes(mealPlan.dishesPerWeek);
      setDiet(mealPlan.diet);
      setPrice(mealPlan.price);
      setIsMealPlanInComponent(true);

      showToast("You already have a meal plan saved", "info");
    }
  }, [
    getSubscriptionReorderDate,
    isActiveSubscriptionInUser,
    mealPlan,
    navigate,
    user?.activeSubscription?.createdAt,
    isMealPlanLoaded,
  ]);

  const handlePeopleClick = (people) => {
    setNumPeople(people);
    calculatePrice(people, numDishes);
  };

  const handleDishesClick = (dishes) => {
    setNumDishes(dishes);
    calculatePrice(numPeople, dishes);
  };

  const handleDietClick = (diet) => {
    setDiet((prev) => {
      if (prev.includes(diet)) {
        return prev.filter((d) => d !== diet);
      } else {
        return [...prev, diet];
      }
    });
  };

  const calculatePrice = (people, dishes) => {
    const basePrice = 5;
    const calculatedPrice = basePrice * people * dishes;
    setPrice(calculatedPrice);
  };

  const getChangedFields = (oldData, formData) => {
    const changedFields = {};

    if (Object.keys(oldData).length === 0) return { noActiveMealPlan: true };

    for (const key in oldData) {
      if (oldData[key] !== formData[key] && formData[key] !== undefined) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
  };

  const handleSubmit = () => {

    // Returns an empty array or error messages in new lines
    const errorMessages = validateMealPlan(numPeople, numDishes, diet);

    if (errorMessages.length > 0) {
      showToast(errorMessages, "error");
      return;
    }

    const mealPlanData = {
      numberOfPeople: numPeople,
      dishesPerWeek: numDishes,
      diet: diet,
      price: price,
      user: user._id,
    };

    const changes = getChangedFields(mealPlan, mealPlanData);

    if (Object.keys(changes).length !== 0) {
      setMealPlanInStateAndStorage(mealPlanData);
      setNumPeople(0);
      setNumDishes(0);
      setDiet([]);
      setPrice(0);
    }

    navigate("/recipes");

    showToast(
      "Meal plan submitted! Your diet filters have been applied!",
      "success"
    );
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="mealPlan-container">
      <section>
        <h1>Meal Plan</h1>
        <h2>Set your meal plan</h2>
        <h3>How many people?</h3>
        <div className="people">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handlePeopleClick(num)}
              className={numPeople === num ? "selected" : ""}
            >
              {num}
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          ))}
        </div>

        <h3>How many dishes per week?</h3>
        <div className="dishesWeek">
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleDishesClick(num)}
              className={numDishes === num ? "selected" : ""}
            >
              {num}
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          ))}
        </div>

        <h3>Diet</h3>
        <div className="diet-list">
          {[
            "Vegan",
            "Vegetarian",
            "Animal-protein",
            "Pescatarian",
            "Low-calories",
            "High-protein",
            "Keto",
            "Paleo",
            "Gluten-free",
            "Dairy-free",
          ].map((dietOption) => (
            <button
              key={dietOption}
              onClick={() => handleDietClick(dietOption)}
              className={diet?.includes(dietOption) ? "selected" : ""}
            >
              {dietOption}
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          ))}
        </div>

        <div>
          <h3>Price:</h3>
          <p>{price} €</p>
        </div>

        {user ? (
          <div>
            <button onClick={handleSubmit}>
              Submit!
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleLoginRedirect}>
              To get a meal Plan, please Log in!
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        )}

        <DishesCarrousel />
      </section>
    </div>
  );
}

export default MealPlan;
