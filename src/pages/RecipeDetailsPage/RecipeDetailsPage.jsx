import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import './RecipeDetailsPage.css'

const MONGO_URI = "http://localhost:5005/dishes";

function RecipeDetailsPage() {


    const [recipe, setRecipe] = useState({});
    
    // Obtain Id from URL
    const { recipeId } = useParams();


    useEffect(() => {
        axios.get(`${MONGO_URI}/${recipeId}`)
           .then(res => setRecipe(res.data))
           .catch(err => console.log(err))
    }, [recipeId])

  return (
    <div>
        
    </div>
  )
}

export default RecipeDetailsPage