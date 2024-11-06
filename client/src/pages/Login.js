// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Login.css";
import TodoList from "./TodoList";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to the login endpoint
            const response = await fetch("http://localhost:3005/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            // Parse the response from the server
            const data = await response.json();
    
            if (response.ok) {
                console.log("Login successful:", data.token);
                onLogin(data.token); // Pass token to set logged-in state or store token as needed
                navigate("/todolist");
            } else {
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred during login");
        }
    };

    // Navigate to register page on button click
    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label className="show-password">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                </label>

                <button type="submit">Login</button>

                {/* Register button */}
                <button type="button" onClick={handleRegisterClick} className="register-button">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Login;
