"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import styles from './Kanban.module.scss';
import { format } from 'date-fns';

export default function TaskCard({ task, onEdit, onDelete }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        data: { ...task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const priorityColors = {
        HIGH: '#ef4444',
        MEDIUM: '#f59e0b',
        LOW: '#10b981'
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes} 
            className={styles.taskCard}
        >
            <div className={styles.cardHeader}>
                <span className={styles.priority} style={{ backgroundColor: priorityColors[task.priority] || '#6b7280' }}>
                    {task.priority}
                </span>
                <div className={styles.actions}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(task); }} 
                        className={styles.actionBtn}
                        title="Edit Task"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete Task"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <h4 className={styles.cardTitle}>{task.title}</h4>
            {task.description && <p className={styles.cardDesc}>{task.description}</p>}
            {task.dueDate && (
                <div className={styles.dueDate}>
                    <Clock size={12} />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
            )}
        </div>
    );
}
