// src/components/TaskList.js
import React from "react";
import "../styles/TaskList.css";

function TaskList({ tasks, toggleTaskStatus, removeTask }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.status === "complete" ? "completed" : ""}`}>
          <div>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p className="task-due">Due: {task.dueDate}</p>
          </div>
          <div>
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={task.status === "incomplete" ? "complete-button" : "complete-button undo-button"}
            >
              {task.status === "incomplete" ? "Complete" : "Undo"}
            </button>
            <button onClick={() => removeTask(task.id)} className="remove-button">
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
