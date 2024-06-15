import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./RecipeList.css";
import "primeicons/primeicons.css"

const MONGO_URI = "http://localhost:5005/dishes";

function RecipesList() {
   // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

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

  return (
    <div className="recipe-menu">
      {recipes &&
        recipes.map((recipe) => (
          <div className="recipe-container"  key={recipe._id}>
            <Link to={`/recipes/${recipe._id}`}>
              <img src={recipe.smallImageURL} alt={`${recipe.name}`}></img>
              <p>{recipe.name}</p>
              <div className="recipe-info">
                <p><span className="pi pi-stopwatch" />{recipe.cookingTime}'</p>
                <p>{recipe.nutritionalValuePerServing.calories}kcal</p>
                <p>{recipe.rating} <span className="pi pi-star-fill" /></p>
              </div>
            </Link>
            {isLoggedIn ? 
            <button>Add to Subscription</button> 
            : ""}
          </div>
        ))}
    </div>
  );
}

export default RecipesList;
