import React, { useState } from 'react';
import axios from 'axios';
import DishesCarrousel from '../../components/DishesCarrousel/DishesCarrousel';
import './MealPlan.css';

const MONGO_URI = "http://localhost:5005/mealplan";


function MealPlan() {

    //add the states

    const [manyPeople, setManyPeople] = useState(0);
    const [manyDishes, setManyDishes] = useState(0);
    const [diets, setDiets] = useState([]);
    const [price, setPrice] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    // function to handle how many people are going to be selected

    const handlePeopleClick = (people) => {
        setManyPeople(people);
        calculatePrice(people, manyDishes);

    };

    // function to handle how many dishes are going to be selected


    const handleDishesClick = (dishes) => {
        setManyDishes(dishes);
        calculatePrice(manyPeople, dishes);
    };

    // function to select several diets


    const handleDietClick = (diet) => {
        setDiets(prev => {
            if (prev.includes(diet)) {
                return prev.filter(d => d !== diet);
            } else {
                return [...prev, diet];
            }
        });
    };

    // Added function to calculate the price based on a fixed price of 10. Redo this with time.


    const calculatePrice = (people, dishes) => {
        const basePrice = 10;
        const calculatedPrice = basePrice * people * dishes;
        setPrice(calculatedPrice);
    };

    // Posting the mealplans to mealPlan route.

    const handleSubmit = () => {
        const mealPlanData = {
            numberOfPeople: manyPeople,
            dishesPerWeek: manyDishes,
            diets: diets,
            price: price,
        }

        axios.post(MONGO_URI, mealPlanData)
        .then(response => {
                        
            // reset the states to its original state

            setManyPeople(0);
            setManyDishes(0);
            setDiets([]);
            setPrice(0);
            setSubmitted(true); // Optionally, set a flag to indicate that the form has been submitted
        })
        .catch(error => {
            // Handle error
            console.error('Error creating meal plan:', error);
            // Optionally, display an error message to the user
        });
    };



    return (
        <div>
            <section>
                <h2>Choose your Meal Plan</h2>
                <h3>How many people?</h3>
                <div>
                    {[1, 2, 3, 4].map((num) => (
                        <button key={num} onClick={() => handlePeopleClick(num)}>{num}</button>
                    ))}
                </div>

                <h3>How many dishes per week?</h3>
                <div>
                    {[2, 3, 4, 5].map((num) => (
                        <button key={num} onClick={() => handleDishesClick(num)}>{num}</button>
                    ))}
                </div>

                <h3>Diet</h3>
                <div>
                    {['Vegan', 'Vegetarian', 'Animal-protein', 'Pescatarian', 'Low-calories', 'High-protein', 'Keto', 'Paleo', 'Gluten-free', 'Dairy-free'].map((diet) => (
                        <button
                            key={diet}
                            onClick={() => handleDietClick(diet)}
                            className={diets.includes(diet) ? 'selected' : ''}
                        >
                            {diet}
                        </button>
                    ))}
                </div>

                <div>
                    <h3>Price:</h3>
                    <p>{price}</p>
                </div>

                <div>
                    <button onClick={handleSubmit}>Submit!</button>
                </div>

                <DishesCarrousel />
            </section>
        </div>
    );
}

export default MealPlan;
