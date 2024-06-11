import React from 'react'
import axios from 'axios'
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel"
import './MealPlan.css'




function MealPlan() {
    return (

        <div>
            <section>
                <h2>Choose your Meal Plan</h2>
                <h3>How many people?</h3>
                <div>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>

                </div>

                <h3>How many dishes per week?</h3>
                <div>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>

                </div>

                <h3>Diet</h3>
                <div>
                    <button>Vegan</button>
                    <button>Vegetarian</button>
                    <button>Animal-protein</button>
                    <button>Pescaterian</button>
                    <button>Low-calories</button>
                    <button>High-protein</button>
                    <button>Keto</button>
                    <button>Paleo</button>
                    <button>Gluten-free</button>
                    <button>Dairy-free</button>

                </div>

                <div>Price:</div>

                <div>
                    <button>Submit!</button>
                </div>

                <DishesCarrousel />


            </section>
        </div>
    )
}

export default MealPlan