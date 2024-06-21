import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";

import "./RecipeList.css";
import "primeicons/primeicons.css";

import Loading from "../Loading/Loading";
import SearchBar from "../SearchBar/SearchBar";

const MONGO_URI = process.env.REACT_APP_SERVER_URL
  ? `${process.env.REACT_APP_SERVER_URL}/dishes`
  : "http://localhost:5005/dishes";

function RecipesList() {
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart, mealPlan } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(MONGO_URI)
      .then((res) => {
        setRecipes(res.data);
        setFilteredRecipes(res.data); // Set initial filtered recipes to all recipes
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting the recipes:", err);
        setLoading(false);
      });
  }, []);

  const handleOriginClick = (origin) => {
    setSelectedOrigins((prevOrigins) =>
      prevOrigins.includes(origin)
        ? prevOrigins.filter((item) => item !== origin)
        : [...prevOrigins, origin]
    );
  };

  const handleDietClick = (diet) => {
    setSelectedDiets((prevDiets) =>
      prevDiets.includes(diet)
        ? prevDiets.filter((item) => item !== diet)
        : [...prevDiets, diet]
    );
  };

  useEffect(() => {
    let recipesToFilter = recipes;

    if (selectedOrigins.length > 0) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        selectedOrigins.some((origin) =>
          recipe.categories.origin.includes(origin)
        )
      );
    }
    if (selectedDiets.length > 0) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        selectedDiets.some((diet) => recipe.categories.diet.includes(diet))
      );
    }
    if (searchTerm) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(recipesToFilter);
    setCurrentPage(1)
  }, [selectedOrigins, selectedDiets, searchTerm, recipes]);

  const handleAddToCart = (recipe) => {
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      addToCart(recipe);
    }
  };

  const uniqueOrigins = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories.origin)),
  ];
  const uniqueDiets = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories.diet)),
  ];

  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe,indexOfLastRecipe);
  const totalRecipes = Math.ceil(filteredRecipes.length/itemsPerPage);

  const handlePage = (PageNum) => {
    setCurrentPage(PageNum)
  }


  return (
    <>
      <div className="filter-and-search">
        <div className="filter-tags">
          <div className="origin-tags">
            <h2>Filter by Origin</h2>
            {uniqueOrigins.map((origin, index) => (
              <button
                key={index}
                onClick={() => handleOriginClick(origin)}
                className={selectedOrigins.includes(origin) ? "active" : ""}
              >
                {origin}
              </button>
            ))}
          </div>
          <div className="diet-tags">
            <h2>Filter by Diet</h2>
            {uniqueDiets.map((diet, index) => (
              <button
                key={index}
                onClick={() => handleDietClick(diet)}
                className={selectedDiets.includes(diet) ? "active" : ""}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
        <div className="search-bar-container">
          <SearchBar onSearch={(term) => setSearchTerm(term)} />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="recipe-menu">
          {currentRecipes.map((recipe) => (
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
              ) : (
                <button
                  className="subscription-button"
                  onClick={() => navigate("/mealplan")}
                >
                  Start Subscription
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
      {[...Array(totalRecipes)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default RecipesList;
