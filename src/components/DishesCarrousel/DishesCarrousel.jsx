import { useState, useEffect, useContext } from "react";
import "./DishesCarrousel.css";
import { CartContext } from "../../context/cart.context";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

function DishesCarrousel() {
  // Define recipes
  const [showRecipes, setShowRecipes] = useState([]);
  const { recipes } = useContext(CartContext);

  // Get 3 random numbers between 0 and recipes.length
  const get3RandomNumbers = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * recipes.length)
  );

  // Get recipes from the database
  useEffect(() => {
    // get 3 random recipes from recipes array
    if (recipes?.length > 0) {
      const showcasedRecipes = get3RandomNumbers.map((index) => recipes[index]);
      setShowRecipes(showcasedRecipes); // Set showRecipes to the first 3 items
    }
  }, [recipes]);

  if (!showRecipes) {
    <Loading />;
  }

  return (
    <>
      {showRecipes && recipes && (
        <div>
          <h3>Look at some of our dishes</h3>
          <section className="carrousel-main">
            {showRecipes &&
              showRecipes.map((recipe) => (
                <Link to={`/recipes/${recipe._id}`} key={recipe._id}>
                  <div
                    className="recipe-showcase-container"
                    style={{
                      backgroundImage: `url(/${encodeURIComponent(
                        recipe.name
                      )}.jpg)`,
                    }}
                  >
                    {/* <img src={`/${recipe.name}.jpg`} alt={`${recipe.name}`}></img> */}
                    <h4>{recipe.name}</h4>
                  </div>
                </Link>
              ))}
          </section>
        </div>
      )}
    </>
  );
}

export default DishesCarrousel;
