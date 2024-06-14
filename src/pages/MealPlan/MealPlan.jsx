import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel";
import "./MealPlan.css";
import authService from "../../services/auth.service.js";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";

const MONGO_URI = "http://localhost:5005/mealplan";

function MealPlan() {
  //add the states

  const [manyPeople, setManyPeople] = useState(0);
  const [manyDishes, setManyDishes] = useState(0);
  const [diet, setDiet] = useState([]);
  const [price, setPrice] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useContext(AuthContext);
  const { setMealPlanInStateAndStorage } = useContext(CartContext);
  const navigate = useNavigate();

  // function to handle how many people are going to be selected

  const handlePeopleClick = (people) => {
    setManyPeople(people);
    calculatePrice(people, manyDishes);
  };

  // function to handle how many dishes are going to be selected

  const handleDishesClick = (dishes) => {
    setManyDishes(dishes);
    calculatePrice(manyPeople, dishes);
  };

  // function to select several diet

  const handleDietClick = (diet) => {
    setDiet((prev) => {
      if (prev.includes(diet)) {
        return prev.filter((d) => d !== diet);
      } else {
        return [...prev, diet];
      }
    });
  };

  // Added function to calculate the price based on a fixed price of 10. Redo this with time.

  const calculatePrice = (people, dishes) => {
    const basePrice = 5;
    const calculatedPrice = basePrice * people * dishes;
    setPrice(calculatedPrice);
  };

  // Posting the mealplans to mealPlan route.

  const handleSubmit = () => {
    const mealPlanData = {
      numberOfPeople: manyPeople,
      dishesPerWeek: manyDishes,
      diet: diet,
      price: price,
      user: user._id,
    };

    authService
      .postMealPlan(mealPlanData)
      .then((response) => {
        setMealPlanInStateAndStorage(response.data);
        setManyPeople(0);
        setManyDishes(0);
        setDiet([]);
        setPrice(0);
        setSubmitted(true); // Optionally, set a flag to indicate that the form has been submitted
        navigate("/recipes");
      })
      .catch((error) => {
        console.error("Error creating meal plan:", error);
      });
  };

  return (
    <div>
      <section>
        <h2>Choose your Meal Plan</h2>
        <h3>How many people?</h3>
        <div>
          {[1, 2, 3, 4].map((num) => (
            <button key={num} onClick={() => handlePeopleClick(num)}>
              {num}
            </button>
          ))}
        </div>

        <h3>How many dishes per week?</h3>
        <div>
          {[2, 3, 4, 5].map((num) => (
            <button key={num} onClick={() => handleDishesClick(num)}>
              {num}
            </button>
          ))}
        </div>

        <h3>Diet</h3>
        <div>
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
          ].map((diet) => (
            <button
              key={diet}
              onClick={() => handleDietClick(diet)}
              className={diet.includes(diet) ? "selected" : ""}
            >
              {diet}
            </button>
          ))}
        </div>

        <div>
          <h3>Price:</h3>
          <p>{price}</p>
        </div>

        <div>
          <button onClick={handleSubmit}>Submit!</button>
        </div>

        <DishesCarrousel />
      </section>
    </div>
  );
}

export default MealPlan;
