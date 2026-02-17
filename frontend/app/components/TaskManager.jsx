"use client"
import React, { useEffect, useState } from "react";
import styles from "./TaskManager.module.scss";
import Calendar from "./Calendar.jsx";
import { apiClient } from '../utils/apiClient';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);

    const fetchTasks = async () => {
        try {
            const data = await apiClient.get('/api/habits');
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
            await apiClient.put(`/api/habits/${editingId}`, form);
        } else {
            await apiClient.post('/api/habits', form);
        }

        setForm({ name: "" });
        setEditingId(null);
        fetchTasks();
    };

    const handleDelete = async (id) => {
        await apiClient.delete(`/api/habits/${id}`);
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
                    placeholder="What habit do you want to track?"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className={styles.submitBtn}>
                    {editingId ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add Task</>}
                </button>
            </form>

            <div className={styles.taskList}>
                {tasks.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No tasks yet. Create one to start tracking!</p>
                    </div>
                )}
                {tasks?.map((task, index) => (
                    <div key={task.id} className={styles.taskCard} style={{ animationDelay: `${index * 0.05}s` }}>
                        <div className={styles.taskHeader}>
                            <h3>{task.name}</h3>
                            <div className={styles.actions}>
                                <button onClick={() => handleEdit(task)} className={styles.editBtn} title="Edit">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(task.id)} className={styles.deleteBtn} title="Delete">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <Calendar
                            habitId={task.id}
                            completions={task.completions}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
