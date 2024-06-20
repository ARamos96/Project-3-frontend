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

  useEffect(() => {
    axios
      .get(MONGO_URI)
      .then((res) => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting the recipes:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (recipe) => {
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      addToCart(recipe);
    }
  };

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
            ) 
            : <button
                className="subscription-button"
                onClick={() => navigate("/mealplan")}
              >
                Start Subscription
              </button>
            }
          </div>
        ))
      )}
    </div>
  );
}

export default RecipesList;
