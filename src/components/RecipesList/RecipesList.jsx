import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MONGO_URI = 'http://localhost:5005/dishes';

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
    <div>
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-container">
          <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
        </div>
      ))}
    </div>
  )
}

export default RecipesList;
