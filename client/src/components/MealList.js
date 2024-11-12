// src/components/MealList.js
import React from "react";
import "../styles/MealList.css";

function MealList({ meals, removeMeal }) {
    return (
        <ul>
            {meals.map((meal) => (
                <li key={meal._id} className="meal-item">
                    <div>
                        <h3>{meal.name}</h3>
                        <p>Type: {meal.mealType}</p> 
                        <p>Description:{meal.description}</p>
                        {/* <p className="meal-calories">Calories: {meal.calories}</p> */}
                        <p className="meal-date">Date: {new Date(meal.dateAdded).toLocaleDateString()}</p> 
                    </div>
                    {/* TODO ASK FIRST */}
                    <button onClick={() => removeMeal(meal._id)} className="remove-meal-button">Remove</button>
                </li>
            ))}
        </ul>
    );
}

export default MealList;
