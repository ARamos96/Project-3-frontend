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
    <div className="recipe-details">
      <h1>{recipe.name}</h1>
      <div className="1st-recipe-section">
        <img src={recipe.bigImageURL} alt={recipe.name}></img>
        <div className="recipe-basic-info">
          <p>{recipe.cookingTime}</p>
          <p>{recipe.rating}</p>
          <p>{recipe.difficulty}</p>
        </div>
        {/* {isSubscribed ? 
      <Link>Add To Subscription</Link>
      : <Link>Let's get started!</Link>} */}
      </div>
      <div className="recipe-tags">
        {recipe.categories && (
          <>
            {recipe.categories.origin.map((origin, index) => (
              <p key={`origin-${index}`}>{origin}</p>
            ))}
            {recipe.categories.diet.map((diet, index) => (
              <p key={`diet-${index}`}>{diet}</p>
            ))}
          </>
        )}
      </div>
      <div className="recipe-ingredients-container">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients &&
            recipe.ingredients.map((ingredient, index) => (
              <li key={`ingredient-${index}`}>{ingredient}</li>
            ))}
        </ul>
      </div>
      {/* Obtain Nutritional Information from Object */}
      {recipe.nutritionalValuePerServing && (
        <div className="nutritional-information-table">
          <h2>Nutritional Information</h2>
          <table>
            <tbody>
              <tr>
                <th>Calories</th>
                <td>{recipe.nutritionalValuePerServing.calories}kcal</td>
              </tr>
              <tr>
                <th>Protein</th>
                <td>{recipe.nutritionalValuePerServing.protein}g</td>
              </tr>
              <tr>
                <th>Carbohydrates</th>
                <td>{recipe.nutritionalValuePerServing.carbohydrates}g</td>
              </tr>
              <tr>
                <th>Fat</th>
                <td>{recipe.nutritionalValuePerServing.fat}g</td>
              </tr>
              <tr>
                <th>Fiber</th>
                <td>{recipe.nutritionalValuePerServing.fiber}g</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {recipe.steps && (
  <ul className="recipe-steps">
    {recipe.steps.map((step, index) => (
      <li key={`step-${index}`}>
        <span><b>Step {index + 1}</b> {step}</span>
      </li>
    ))}
  </ul>
)}
    </div>
  );
}

export default RecipeDetailsPage;
