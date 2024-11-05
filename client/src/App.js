// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoList from "./pages/TodoList";
import Nutrition from "./pages/Nutrition";
import Sports from "./pages/Sports";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar />
          <div style={{ paddingTop: "25px" }}>
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/sports" element={<Sports />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
        <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login onLogin={handleLogin} />} />
        </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
