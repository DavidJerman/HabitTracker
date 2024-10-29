// src/pages/Nutrition.js
import React, { useState } from "react";
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
                <button onClick={addMeal} className="add-meal-button">Add Meal</button>
            </div>

            {/* Meal List */}
            <MealList meals={meals} removeMeal={removeMeal} />
        </div>
    );
}

export default Nutrition;
