"use client";
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import styles from './Kanban.module.scss';

export default function KanbanColumn({ id, tasks, onEditTask, onDeleteTask }) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className={styles.column}>
            <div ref={setNodeRef} className={styles.droppableArea}>
                {tasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={onEditTask} 
                        onDelete={onDeleteTask} 
                    />
                ))}
            </div>
        </div>
    );
}

