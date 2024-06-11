import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Footer from "./components/Footer/Footer";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HowItWorksPage from "./pages/HowItWorksPage/HowItWorksPage";
import RecipesPage from "./pages/RecipesPage/RecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage/RecipeDetailsPage";
import MealPlan from "./pages/MealPlan/MealPlan";

import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

function App() {
  return (
    <div className="App">
      <Navbar />

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

        <Route
          path="/howitworks"
          element={
            <IsAnon>
              <HowItWorksPage />
            </IsAnon>
          }
        />

        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
