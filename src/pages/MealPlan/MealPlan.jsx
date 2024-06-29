import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel";
import "./MealPlan.css";
import authService from "../../services/auth.service.js";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MealPlan() {
  //add the states

  const [manyPeople, setManyPeople] = useState(0);
  const [manyDishes, setManyDishes] = useState(0);
  const [diet, setDiet] = useState([]);
  const [price, setPrice] = useState(0);
  const { user } = useContext(AuthContext);
  const { setMealPlanInStateAndStorage, mealPlan } = useContext(CartContext);
  const navigate = useNavigate();

  // If there is an existing meal plan, fill out the fields and alert the user
  useEffect(() => {
    if (Object.keys(mealPlan).length > 0) {
      setManyPeople(mealPlan.numberOfPeople);
      setManyDishes(mealPlan.dishesPerWeek);
      setDiet(mealPlan.diet);
      setPrice(mealPlan.price);

      toast.info("You already have a meal plan saved", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [mealPlan]);

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

  // Check if there are any changed fields between stored meal plan and form data
  const getChangedFields = (oldData, formData) => {
    const changedFields = {};

    // Ignore undefined values:
    // only compare the formData with existing fields in oldData
    for (const key in oldData) {
      if (oldData[key] !== formData[key] && formData[key] !== undefined) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
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
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
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

    const changes = getChangedFields(mealPlan, mealPlanData);
    // If there are any changed fields between stored meal plan and form data, navigate
    if (Object.keys(changes).length === 0) navigate("/recipes");

    authService
      .postMealPlan(mealPlanData)
      .then((response) => {
        setMealPlanInStateAndStorage(response.data);
        setManyPeople(0);
        setManyDishes(0);
        setDiet([]);
        setPrice(0);
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
          theme: "dark",
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
        <h1>Meal Plan</h1>
        <h2>Set your meal plan</h2>
        <h3>How many people?</h3>
        <div className="people">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handlePeopleClick(num)}
              className={manyPeople === num ? "selected" : ""}
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
              className={manyDishes === num ? "selected" : ""}
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
              className={diet.includes(dietOption) ? "selected" : ""}
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
