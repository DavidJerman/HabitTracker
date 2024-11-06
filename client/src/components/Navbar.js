// src/components/Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink
                        to="/todolist"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        TODO List
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/nutrition"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Nutrition
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/sports"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Sports
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
