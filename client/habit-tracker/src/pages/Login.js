// src/pages/Login.js
import React, { useState } from "react";
import "../styles/Login.css";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple authentication check (replace with real auth logic)
        if (username === "user" && password === "password") {
            onLogin(); // Set logged-in state in App component
        } else {
            alert("Invalid username or password");
        }
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
                    type={showPassword ? "text" : "password"} // Toggle between password and text
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* Show Password Checkbox */}
                <label className="show-password">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                </label>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
