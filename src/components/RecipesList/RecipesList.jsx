import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import "./RecipeList.css";
import "primeicons/primeicons.css"

const MONGO_URI = `${process.env.REACT_APP_SERVER_URL}/dishes` || "http://localhost:5005/dishes";

function RecipesList() {
   // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart, mealPlan } = useContext(CartContext);
  const navigate = useNavigate();

  // Define recipes
  const [recipes, setRecipes] = useState([]);

  // Get recipes from the database
  useEffect(() => {
    axios
      .get(MONGO_URI)
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Handler function to add recipe to the cart
  const handleAddToCart = (recipe) => {
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      addToCart(recipe);
    }
  };

  return (
    <div className="recipe-menu">
      {recipes &&
        recipes.map((recipe) => (
          <div className="recipe-container"  key={recipe._id}>
            <Link to={`/recipes/${recipe._id}`}>
              <img src={recipe.smallImageURL} alt={`${recipe.name}`}></img>
              <p>{recipe.name}</p>
              <div className="recipe-info">
                <p><span className="pi pi-stopwatch" /> {recipe.cookingTime}'</p>
                <p>{recipe.nutritionalValuePerServing.calories}kcal</p>
                <p>{recipe.rating} <span className="pi pi-star-fill" /></p>
              </div>
            </Link>
            {isLoggedIn ? 
            <button className='subscription-button' onClick={() => handleAddToCart(recipe)}>Add to Subscription</button> 
            : ""}
          </div>
        ))}
    </div>
  );
}

export default RecipesList;
