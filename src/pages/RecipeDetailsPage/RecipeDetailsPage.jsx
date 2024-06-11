import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./RecipeDetailsPage.css";

const MONGO_URI = "http://localhost:5005/dishes";

function RecipeDetailsPage() {
  const [recipe, setRecipe] = useState({});

  // Obtain Id from URL
  const { recipeId } = useParams();

  // Get single recipe details
  useEffect(() => {
    axios
      .get(`${MONGO_URI}/${recipeId}`)
      .then((res) => setRecipe(res.data))
      .catch((err) => console.log(err));
  }, [recipeId]);

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
    </div>
  );
}

export default RecipeDetailsPage;
