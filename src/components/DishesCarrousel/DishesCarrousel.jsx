import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./DishesCarrousel.css";

const MONGO_URI = process.env.REACT_APP_SERVER_URL
  ? `${process.env.REACT_APP_SERVER_URL}/dishes`
  : "http://localhost:5005/dishes";

function DishesCarrousel() {
  // Define recipes
  const [showRecipes, setShowRecipes] = useState([]);

  // Get recipes from the database
  useEffect(() => {
    axios
      .get(MONGO_URI)
      .then((res) => {
        setShowRecipes(res.data.slice(0, 3)); // Set showRecipes to the first 3 items
      })
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  return (
    <div>
      <h3>Look at some of our dishes</h3>
      <section className="carrousel-main">
        {showRecipes &&
          showRecipes.map((recipe, index) => (
            <div className="recipe-showcase-container" key={index}>
              <img src={recipe.smallImageURL} alt={`${recipe.name}`}></img>
              <h4>{recipe.name}</h4>
            </div>
          ))}
      </section>
    </div>
  );
}

export default DishesCarrousel;
