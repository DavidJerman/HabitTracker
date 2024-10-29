// src/pages/TodoList.js
import React, { useState } from "react";
import TaskList from "../components/TaskList";
import "../styles/TodoList.css";

function TodoList() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Workout",
      description: "Go for a 30-minute run",
      dueDate: "2023-12-12",
      type: "recurring",
      frequency: { daily: true, weekly: ["Monday", "Wednesday", "Friday"], monthly: false },
      status: "incomplete",
    },
  ]);

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    type: "one-time",
    frequency: {},
    status: "incomplete",
  });

  // Toggle task completion status
  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: task.status === "incomplete" ? "complete" : "incomplete" } : task
      )
    );
  };

  // Add a new task
  const addTask = () => {
    if (newTask.name && newTask.description) {
      setTasks([
        ...tasks,
        { ...newTask, id: tasks.length + 1 },
      ]);
      setNewTask({ name: "", description: "", dueDate: "", type: "one-time", frequency: {}, status: "incomplete" });
    }
  };

  // Remove a task by ID
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Sort tasks by due date, incomplete tasks first, and completed tasks at the end
  const sortedTasks = tasks
    .slice() // Create a copy of the tasks array
    .sort((a, b) => {
      if (a.status === "complete" && b.status === "incomplete") return 1;
      if (a.status === "incomplete" && b.status === "complete") return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  return (
    <div className="todo-container">
      <h1 className="todo-title">TODO List</h1>

      <div className="task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={addTask} className="add-task-button">Add Task</button>
      </div>

      <TaskList tasks={sortedTasks} toggleTaskStatus={toggleTaskStatus} removeTask={removeTask} />
    </div>
  );
}

export default TodoList;
