import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import {
  Button,
  IconButton,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Info,
  ShoppingCart,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";

import "./RecipeList.css";
import "primeicons/primeicons.css";

import Loading from "../Loading/Loading";
import SearchBar from "../SearchBar/SearchBar";

const MONGO_URI = process.env.REACT_APP_SERVER_URL
  ? `${process.env.REACT_APP_SERVER_URL}/dishes`
  : "http://localhost:5005/dishes";

function RecipesList() {
  const {
    isLoggedIn,
    favdishes,
    addFavDish,
    removeFavDish,
    addFavoriteToDB,
    user,
  } = useContext(AuthContext);
  const { addToCart, mealPlan } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [initialSelectedDiets, setInitialSelectedDiets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
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

    return () => {
      if (isLoggedIn && user) {
        const response = addFavoriteToDB(favdishes);
      }
      
    };
    
  }, []);

  useEffect(() => {
    // Extract unique diets from recipes to initialize initialSelectedDiets
    const uniqueDiets = [
      ...new Set(recipes.flatMap((recipe) => recipe.categories.diet)),
    ];
    setInitialSelectedDiets(uniqueDiets);

    // If there are selected diets in mealPlan, set them as selectedDiets
    if (mealPlan && mealPlan.diet && mealPlan.diet.length > 0) {
      setSelectedDiets(mealPlan.diet);
    } else {
      setSelectedDiets(initialSelectedDiets);
    }
  }, [recipes, mealPlan]);

  useEffect(() => {
    // Start with all recipes for filtering
    let recipesToFilter = recipes;

    // If there are selected origins, filter recipes by these origins
    if (selectedOrigins.length > 0) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        selectedOrigins.some((origin) =>
          recipe.categories.origin.includes(origin)
        )
      );
    }

    // If there are selected diets, filter recipes by these diets
    if (selectedDiets.length > 0) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        selectedDiets.some((diet) => recipe.categories.diet.includes(diet))
      );
    }

    // If there is a search term, filter recipes by the search term
    if (searchTerm) {
      recipesToFilter = recipesToFilter.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Update the filtered recipes state and reset the current page to 1
    setFilteredRecipes(recipesToFilter);
    setCurrentPage(1);
  }, [selectedOrigins, selectedDiets, searchTerm, recipes]);

  const handleOriginClick = (origin) => {
    // Update the selectedOrigins state based on the clicked origin.
    // If the origin is already selected, remove it. Otherwise, add it.
    setSelectedOrigins((prevOrigins) =>
      prevOrigins.includes(origin)
        ? prevOrigins.filter((item) => item !== origin)
        : [...prevOrigins, origin]
    );
  };

  const handleDietClick = (diet) => {
    // Update the selectedDiets state based on the clicked diet.
    // If the diet is already selected, remove it. Otherwise, add it.
    setSelectedDiets((prevDiets) =>
      prevDiets.includes(diet)
        ? prevDiets.filter((item) => item !== diet)
        : [...prevDiets, diet]
    );
  };

  const handleAddToCart = (recipe) => {
    // If mealPlan or dishesPerWeek is not set, navigate to the meal plan page
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      // Otherwise, add the selected recipe to the cart
      addToCart(recipe);
    }
  };

  // check if the dish is in favorites
  const isInFavorites = (recipeId) => {
    return favdishes.some((dish) => dish._id === recipeId);
  };

  // handling favorites
  const handleToggleFavorite = (recipe) => {
    if (isInFavorites(recipe._id)) {
      removeFavDish(recipe._id);
    } else {
      addFavDish(recipe);
    }
  };

  // Extract unique origins from recipes to create the filter options
  const uniqueOrigins = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories.origin)),
  ];

  // Extract unique diets from recipes to create the filter options
  const uniqueDiets = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories.diet)),
  ];

  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalRecipes = Math.ceil(filteredRecipes.length / itemsPerPage);

  const handlePage = (PageNum) => {
    setCurrentPage(PageNum);
  };

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
                <span></span>
                <span></span>
                <span></span>
                <span></span>
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
                <span></span>
                <span></span>
                <span></span>
                <span></span>
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
            <div
              className="recipe-container"
              key={recipe._id}
              style={{
                backgroundImage: `url(/${encodeURIComponent(recipe.name)}.jpg)`,
              }}
            >
              <Link to={`/recipes/${recipe._id}`}>
                {/* <img src={`/${recipe.name}.jpg`} alt={`${recipe.name}`} /> */}
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
              {isLoggedIn && (
                <IconButton
                  onClick={() => handleToggleFavorite(recipe)}
                  color="secondary"
                >
                  {isInFavorites(recipe._id) ? (
                    <Bookmark />
                  ) : (
                    <BookmarkBorder />
                  )}
                </IconButton>
              )}
              {isLoggedIn && mealPlan && mealPlan.dishesPerWeek ? (
                <button
                  className="subscription-button"
                  onClick={() => handleAddToCart(recipe)}
                >
                  Add to cart
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              ) : (
                <button
                  className="subscription-button"
                  onClick={() => navigate("/mealplan")}
                >
                  Start Subscription
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              )}
              <button
                className="info-button"
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              >
                + Info
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
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
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        ))}
      </div>
    </>
  );
}

export default RecipesList;
