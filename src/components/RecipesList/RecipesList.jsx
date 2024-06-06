import "./RecipeList.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MONGO_URI = "http://localhost:5005/dishes";

function RecipesList() {
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
          <div className="recipe-container">
            <Link to={`/recipes/${recipe._id}`} key={recipe._id}>
              <img src={recipe.image} alt={`${recipe.name}`}></img>
              <p>{recipe.name}</p>
              <div className="recipe-info">
                <p>{recipe.cookingTime}'</p>
                <p>{recipe.nutritionalValuePerServing.calories}kcal</p>
                <p>{recipe.rating}⭐</p>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default RecipesList;
