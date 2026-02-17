"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './TaskModal.module.scss';

export default function TaskModal({ isOpen, onClose, onSave, task, initialStatus }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: initialStatus || 'TODO',
        dueDate: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'MEDIUM',
                status: task.status || 'TODO',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                status: initialStatus || 'TODO',
                dueDate: ''
            });
        }
    }, [task, initialStatus, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (dataToSave.dueDate && !dataToSave.dueDate.includes('T')) {
            dataToSave.dueDate = `${dataToSave.dueDate}T00:00:00`;
        }
        onSave(dataToSave);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>{task ? 'Edit Task' : 'New Task'}</h3>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Title</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            placeholder="Laundry, Coding, etc."
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Description</label>
                        <textarea 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            placeholder="Add more details..."
                        />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Priority</label>
                            <select 
                                value={formData.priority} 
                                onChange={e => setFormData({...formData, priority: e.target.value})}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Due Date</label>
                            <input 
                                type="date" 
                                value={formData.dueDate} 
                                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                            />
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
