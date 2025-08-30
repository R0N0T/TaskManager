"use client"
import React, { useEffect, useState } from "react";
import styles from "./TaskManager.module.scss";
import Calendar from "./Calendar";

const API_BASE = "http://localhost:8080/api/tasks";

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", description: "" });
    const [editingId, setEditingId] = useState(null);

    const fetchTasks = async () => {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setForm({ title: "", description: "" });
        setEditingId(null);
        fetchTasks();
    };

    const handleDelete = async (id) => {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        fetchTasks();
    };

    const handleEdit = (task) => {
        setForm({ title: task.title, description: task.description });
        setEditingId(task.id);
    };

    return (
        <div className={styles.container}>
            
            <h2 className={styles.title}>Task Manager</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />
                <button type="submit">
                    {editingId ? "Update Task" : "Add Task"}
                </button>
            </form>

            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <div key={task.id} className={styles.taskCard}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <Calendar />
                        <div className={styles.actions}>
                            <button onClick={() => handleEdit(task)}>Edit</button>
                            <button
                                className="delete"
                                onClick={() => handleDelete(task.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
