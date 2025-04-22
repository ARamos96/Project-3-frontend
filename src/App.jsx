import "./styles/main.scss";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import NewProfilePage from "./pages/ProfilePage/NewProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HowItWorksPage from "./pages/HowItWorksPage/HowItWorksPage";
import RecipesPage from "./pages/RecipesPage/RecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage/RecipeDetailsPage";
import MealPlan from "./pages/MealPlan/MealPlan";
import CheckOut from "./pages/Checkout/CheckOut";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMainContent(true);
    }, 1000); // matches the typing animation duration

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="App">
      <div className="page-container">
        <div className="top-heading">
          <h1>
            {!showMainContent ? (
              <span className="typewriter-text">SavorSwift!</span>
            ) : (
              "SavorSwift!"
            )}
          </h1>
        </div>

        {showMainContent && (
          <div className="fade-in">
            <Navbar />
            <ToastContainer />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/profile"
                element={
                  <IsPrivate>
                    <NewProfilePage />
                  </IsPrivate>
                }
              />
              <Route
                path="/signup"
                element={
                  <IsAnon>
                    <SignupPage />
                  </IsAnon>
                }
              />
              <Route
                path="/login"
                element={
                  <IsAnon>
                    <LoginPage />
                  </IsAnon>
                }
              />
              <Route path="/mealplan" element={<MealPlan />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/howitworks" element={<HowItWorksPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route
                path="/recipes/:recipeId"
                element={<RecipeDetailsPage />}
              />
            </Routes>

            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
