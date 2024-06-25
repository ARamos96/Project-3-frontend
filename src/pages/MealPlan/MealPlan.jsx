import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel";
import "./MealPlan.css";
import authService from "../../services/auth.service.js";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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
    // Display error toaster if number of people isn't selected
    if (manyPeople === 0) {
      toast.error("Please select the number of people.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Prevent form submission
    }

    // Display error toaster if number of dishes isn't selected
    if (manyDishes === 0) {
      toast.error("Please select the number of dishes per week.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Prevent form submission
    }
    // Display error toaster if diet isn't selected
    if (diet.length === 0) {
      toast.error("Please select at least one diet option.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; 
    } 
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
        setSubmitted(true); // Returns true to indicate that the form has been submitted
        navigate("/recipes");

        //toast with success submission

        toast.success("Meal plan submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      })
      .catch((error) => {
        console.error("Error creating meal plan:", error);

        //tast wit error submission

        toast.error("Error submitting meal plan. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  // Added for the conditional rendering when the user is not logged.

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <section>
        <h2>Choose your Meal Plan</h2>
        <h3>How many people?</h3>
        <div className="people">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handlePeopleClick(num)}
              className={manyPeople === num ? "selected" : ""}
            >
              {num}
              <span></span><span></span><span></span><span></span>

            </button>
          ))}
        </div>

        <h3>How many dishes per week?</h3>
        <div className="dishesWeek">
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleDishesClick(num)}
              className={manyDishes === num ? "selected" : ""}
            >
              {num}
              <span></span><span></span><span></span><span></span>

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
              className={diet.includes(dietOption) ? "selected" : ""}
            >
              {dietOption}
              <span></span><span></span><span></span><span></span>

            </button>
          ))}
        </div>

        <div>
          <h3>Price:</h3>
          <p>{price} €</p>
        </div>



        {user ? (
          <div>
            <button onClick={handleSubmit}>Submit!
              <span></span><span></span><span></span><span></span>

            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleLoginRedirect}>To get a meal Plan, please Log in!
              <span></span><span></span><span></span><span></span>

            </button>
          </div>
        )}

        <DishesCarrousel />
      </section>
    </div>
  );
}

export default MealPlan;
