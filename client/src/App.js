// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoList from "./pages/TodoList";
import Nutrition from "./pages/Nutrition";
import Sports from "./pages/Sports";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {/* Always render Navbar if you want consistent navigation */}
      <Navbar />

      <div style={{ paddingTop: "25px" }}>
        <Routes>
          {/* Publicly accessible Nutrition page */}
          <Route path="/register" element={<Register />} />

          {/* Protected routes only accessible after login */}
          {isLoggedIn ? (
            <>
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/todolist" element={<TodoList />} />
              <Route path="/sports" element={<Sports />} />
            </>
          ) : (
            // Render Login if not logged in and accessing protected pages
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
