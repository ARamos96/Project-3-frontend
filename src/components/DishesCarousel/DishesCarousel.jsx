import { useState, useEffect, useContext } from "react";
import "./DishesCarousel.css";
import { CartContext } from "../../context/cart.context";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

function DishesCarousel() {
  // Define recipes
  const [showRecipes, setShowRecipes] = useState([]);
  const { recipes } = useContext(CartContext);

  // Get 3 non-repeating random numbers between 0 and recipes.length
  const get3UniqueRandomNumbers = (length) => {
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < 3) {
      uniqueNumbers.add(Math.floor(Math.random() * length));
    }

    return Array.from(uniqueNumbers);
  };

  // Get recipes from the database
  useEffect(() => {
    if (recipes?.length > 0) {
      const randomIndices = get3UniqueRandomNumbers(recipes.length);
      const showcasedRecipes = randomIndices.map((index) => recipes[index]);
      setShowRecipes(showcasedRecipes);
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

export default DishesCarousel;
