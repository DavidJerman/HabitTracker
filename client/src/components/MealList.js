// src/components/MealList.js
import React from "react";
import "../styles/MealList.css";

function MealList({ meals, removeMeal }) {
    return (
        <ul>
            {meals.map((meal) => (
                <li key={meal.id} className="meal-item">
                    <div>
                        <h3>{meal.type}</h3>
                        <p>{meal.description}</p>
                        <p className="meal-calories">Calories: {meal.calories}</p>
                        <p className="meal-date">Date: {meal.date}</p>
                    </div>
                    <button onClick={() => removeMeal(meal.id)} className="remove-meal-button">Remove</button>
                </li>
            ))}
        </ul>
    );
}

export default MealList;
