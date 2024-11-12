// src/pages/Nutrition.js
import React, { useState, useEffect } from "react";
import MealList from "../components/MealList"; // Component to display the list of meals
import "../styles/Nutrition.css"; // CSS for Nutrition page

function Nutrition() {
    const [meals, setMeals] = useState([]);
    const [newMeal, setNewMeal] = useState({
        type: "Breakfast", // default meal type
        description: "",
        name: "",
        // date: "",
    });
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [filter, setFilter] = useState({name: ''});

    const handleIngredientClick = (ingredient) => {
        if (!selectedIngredients.some((item) => item._id === ingredient._id)) {
            setSelectedIngredients([
                ...selectedIngredients,
                ingredient
            ]);
          }
    };

    const handleQuantityChange = (id, value) => {
        setSelectedIngredients(
            selectedIngredients.map((ingredient) =>
                ingredient._id === id ? { ...ingredient, quantity: value } : ingredient
            )
        );
    };

    const removeSelectedIngredient = (id) => {
        setSelectedIngredients(selectedIngredients.filter((ingredient) => ingredient._id !== id));
    };

    // Add new meal to the list
    async function addMeal() {

        const token = localStorage.getItem("token");

        if (!token) {
            console.log("User not authenticated");
            return;
        }

        const missingQuantity = selectedIngredients.some(
            (ingredient) => !ingredient.quantity || ingredient.quantity <= 0
        )

        console.log(selectedIngredients);

        const formattedIngredients = selectedIngredients.map((ingredient) => ({
            ingredient: ingredient._id,
            quantity: ingredient.quantity
        }))

        if (missingQuantity){
            // setError("Quantity not set!");
            return;
        }

        if (newMeal.type) {
            // setMeals([...meals, { ...newMeal, id: meals.length + 1 }]);
            const res = await fetch("http://localhost:3000/nutrition/addMeal", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    name: newMeal.name,
                    description: newMeal.description,
                    mealType: newMeal.type,
                    ingredients: formattedIngredients
                })
            })

            const data = await res.json();
            console.log(data);

            setNewMeal({ type: "Breakfast", description: "", name: "", date: "" });
            setSelectedIngredients([]);
            setFilter({name: ''});

            fetchMeals();
        }
        else {
            // setError("Meal type not set!")
        }
    };

    // Remove meal by ID
    async function removeMeal(id) {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("User not authenticated");
            return;
        }

        await fetch("http://localhost:3000/nutrition/delete", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                mealId: id
            })
        })

        fetchMeals();
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

    async function fetchMeals() {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("User not authenticated");
            return;
        }

        const res = await fetch("http://localhost:3000/nutrition/meals", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token
            }) 
        });

        const data = await res.json();
        console.log(data);
        setMeals(data);
    }

    useEffect(() => {   
        fetchMeals();
    }, []);

    return (
        <div className="nutrition-container">
            <h1 className="nutrition-title">ADD NEW MEAL</h1>

            {/* Add Meal Form */}
            <div className="meal-form">

                <input
                    type="text"
                    placeholder="Name"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newMeal.description}
                    onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                />
                {/* TODO MAKE ALREADY BE SET AND ADD CURRENT TIME */}
                {/* <input
                    type="date"
                    placeholder=""
                    value={newMeal.date}
                    onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                /> */}
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
                                <li key={ingredient._id}>
                                    {/* Ingreadient name */}
                                    {ingredient.name}

                                    {/* quantity box */}
                                    <input
                                        type="number"
                                        placeholder="(g)"
                                        value={ingredient.amount}
                                        onChange={(e) => handleQuantityChange(ingredient._id, e.target.value)}
                                    />

                                    {/* remove from selected list */}
                                    <button
                                        className="remove-ingredient-button"
                                        onClick={() => removeSelectedIngredient(ingredient._id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li>No ingredients selected yet.</li>
                        )}
                    </ul>          
                </div>
                <button onClick={addMeal} className="add-meal-button">Add Meal</button>
            </div>
            
            <div className="list-container">
                <h1 className="nutrition-title">MEAL LIST</h1>
                {/* Meal List */}
                <MealList meals={meals} removeMeal={removeMeal} />
            </div>

        </div>
    );
}

export default Nutrition;
