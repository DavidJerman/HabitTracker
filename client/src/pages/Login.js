// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful:", data.token);
                localStorage.setItem("token", data.token);
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

    const handleRegisterClick = () => {
        navigate('/register');
    }

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
            </form>
            <p>
                Don't have an account?{" "}
                <button onClick={handleRegisterClick} className="">
                    Register here
                </button>
            </p>
        </div>
    );
}

export default Login;
