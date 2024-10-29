// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoList from "./pages/TodoList";
import Nutrition from "./pages/Nutrition";
import Sports from "./pages/Sports";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

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
        <Login onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;
