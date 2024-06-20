import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import "./RecipeList.css";
import "primeicons/primeicons.css";

import Loading from "../Loading/Loading";

const MONGO_URI = process.env.REACT_APP_SERVER_URL
  ? `${process.env.REACT_APP_SERVER_URL}/dishes`
  : "http://localhost:5005/dishes";

function RecipesList() {
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart, mealPlan } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Retrieve all recipes from the server
  useEffect(() => {
    axios
      .get(MONGO_URI)
      .then((res) => {
        setRecipes(res.data);
        setFilteredRecipes(res.data); // Set initial filtered recipes to all recipes
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting the recipes:", err);
        setLoading(false);
      });
  }, []);

  // Function to handle origin tag click
  const handleOriginClick = (origin) => {
    setSelectedOrigin(origin);
    filterRecipes(origin, selectedDiet);
  };

  // Function to handle diet tag click
  const handleDietClick = (diet) => {
    setSelectedDiet(diet);
    filterRecipes(selectedOrigin, diet);
  };

  // Function to filter recipes based on selected origin and diet
  const filterRecipes = (origin, diet) => {
    let recipesToFilter = recipes;
    if (origin) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        recipe.categories.origin.includes(origin)
      );
    }
    if (diet) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        recipe.categories.diet.includes(diet)
      );
    }
    setFilteredRecipes(recipesToFilter);
  };

  // Add to cart function, if no meal plan, redirect to meal plan, else, add recipe to cart
  const handleAddToCart = (recipe) => {
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      addToCart(recipe);
    }
  };

  // Extract unique origins and diets for rendering filter buttons
  const uniqueOrigins = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories.origin)),
  ];
  const uniqueDiets = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories.diet)),
  ];

  return (
    <div className="recipe-menu">
      {loading ? (
        <Loading />
      ) : (
        recipes.map((recipe) => (
          <div className="recipe-container" key={recipe._id}>
            <Link to={`/recipes/${recipe._id}`}>
              <img src={recipe.smallImageURL} alt={`${recipe.name}`} />
              <p>{recipe.name}</p>
              <div className="recipe-info">
                <p>
                  <span className="pi pi-stopwatch" /> {recipe.cookingTime}'
                </p>
                <p>{recipe.nutritionalValuePerServing.calories}kcal</p>
                <p>
                  {recipe.rating} <span className="pi pi-star-fill" />
                </p>
              </div>
            </Link>
            {isLoggedIn && mealPlan && mealPlan.dishesPerWeek ? (
              <button
                className="subscription-button"
                onClick={() => handleAddToCart(recipe)}
              >
                Add to Subscription
              </button>
            ) : (
              <button
                className="subscription-button"
                onClick={() => navigate("/mealplan")}
              >
                Start Subscription
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RecipesList;
