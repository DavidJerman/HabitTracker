// src/pages/Nutrition.js
import React, { useState, useEffect } from "react";
import MealList from "../components/MealList"; // Component to display the list of meals
import "../styles/Nutrition.css"; // CSS for Nutrition page

function Nutrition() {
    const [meals, setMeals] = useState([]);
    const [newMeal, setNewMeal] = useState({
        type: "Breakfast", // default meal type
        description: "",
        calories: "",
        date: "",
    });
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [filter, setFilter] = useState({name: ''});

    const handleIngredientClick = (ingredient) => {
        if (!selectedIngredients.some((item) => item._id === ingredient._id)) {
            setSelectedIngredients([...selectedIngredients, ingredient]);
          }
    };
    

    // Add new meal to the list
    const addMeal = () => {
        if (newMeal.type && newMeal.calories && newMeal.date) {
            setMeals([...meals, { ...newMeal, id: meals.length + 1 }]);
            setNewMeal({ type: "Breakfast", description: "", calories: "", date: "" });
        }
    };

    // Remove meal by ID
    const removeMeal = (id) => {
        setMeals(meals.filter((meal) => meal.id !== id));
    };

    async function fetchIngredients() {

        const res = await fetch("http://localhost:3000/nutrition/ingredients", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter })
        })

        const data = await res.json();
        setIngredients(data);
    }

    useEffect(() => {
        fetchIngredients();
    }, [filter])

    return (
        <div className="nutrition-container">
            <h1 className="nutrition-title">Nutrition Tracker</h1>

            {/* Add Meal Form */}
            <div className="meal-form">
                <select
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Brunch">Brunch</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                </select>

                <input
                    type="text"
                    placeholder="Description"
                    value={newMeal.description}
                    onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Calories"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                />
                <input
                    type="date"
                    value={newMeal.date}
                    onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Ingredient"
                    value={filter.name}
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                />
                <div>
                    {ingredients.length > 0 && filter.name != '' &&(
                    <ul>
                            {ingredients.map(ingredient => (
                                <li onClick={() => handleIngredientClick(ingredient) }>
                                    {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <h3>Selected Ingredients:</h3>
                    <ul>
                        {selectedIngredients.length > 0 ? (
                            selectedIngredients.map((ingredient) => (
                                <li key={ingredient._id}>{ingredient.name}</li>
                            ))
                        ) : (
                            <li>No ingredients selected yet.</li>
                        )}
                    </ul>          
                </div>
                <button onClick={addMeal} className="add-meal-button">Add Meal</button>
            </div>
            

            {/* Meal List */}
            <MealList meals={meals} removeMeal={removeMeal} />
        </div>
    );
}

export default Nutrition;
