import React, { useState } from "react";

function AddTaskForm({ addTask }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [frequency, setFrequency] = useState("one-time");

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask({
            id: Date.now(),
            name,
            description,
            dueDate,
            frequency,
            status: "incomplete",
        });
        setName("");
        setDescription("");
        setDueDate("");
        setFrequency("one-time");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="one-time">One-Time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
    );
}

export default AddTaskForm;

