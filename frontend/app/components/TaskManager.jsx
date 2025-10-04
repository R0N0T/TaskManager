"use client"
import React, { useEffect, useState } from "react";
import styles from "./TaskManager.module.scss";
import Calendar from "./Calendar.jsx";
import { apiClient } from '../utils/apiClient';

const API_BASE = "http://localhost:8080/habits";

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);

    const fetchTasks = async () => {
        try {
            const data = await apiClient.get('/habits');
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleChange = (e) => {
        const { value } = e.target;
        setForm((prev) => ({ ...prev, name: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
        if (method === 'PUT') {
            await apiClient.put(`/habits/${editingId}`, form);
        } else {
            await apiClient.post('/habits', form);
        }

        setForm({ name: "" });
        setEditingId(null);
        fetchTasks();
    };

    const handleDelete = async (id) => {
        console.log(tasks,'debug');
        await apiClient.delete(`/habits/${id}`);
        fetchTasks();
    };

    const handleEdit = (task) => {
        setForm({ name: task.name });
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
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <button type="submit">
                    {editingId ? "Update Task" : "Add Task"}
                </button>
            </form>

            <div className={styles.taskList}>
                {tasks?.map((task) => (
                    <div key={task.id} className={styles.taskCard}>
                        <h3>{task.name}</h3>
                        <Calendar 
                            habitId={task.id}
                            completions={task.completions}
                        />
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
