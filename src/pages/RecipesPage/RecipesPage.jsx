import RecipesList from "./../../components/RecipesList/RecipesList";
import './RecipesPage.css'
function RecipesPage() {
  return (
    <div className="recipe-page">
      <h1>Our Dishes</h1>
      <RecipesList />
    </div>
  );
}

export default RecipesPage;
