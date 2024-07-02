import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import PrimeReactNavbar from "./components/Navbar/PrimeReactNavbar";

import Footer from "./components/Footer/Footer";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
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
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // save the cart, mealplan to user
      // Perform your global cleanup actions here
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <div className="App">
      <PrimeReactNavbar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
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
        <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
