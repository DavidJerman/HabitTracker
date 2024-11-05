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

        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data.token){
            //TODO SAVE TOKEN
            onLogin();
        } else {
            setUsername("");
            setPassword("");
            alert("Invalid username or password");
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
