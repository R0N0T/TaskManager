"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import TaskModal from './TaskModal';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import styles from './Kanban.module.scss';
import { apiClient } from '../../utils/apiClient';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const COLUMNS = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' }
];

export default function KanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [modalCategory, setModalCategory] = useState('TODO');
    
    const { userId } = useAuth();
    const stompClientRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        fetchTasks();
        if (userId) {
            connectWebSocket();
        }
        return () => disconnectWebSocket();
    }, [userId]);

    const fetchTasks = async () => {
        try {
            const data = await apiClient.get('/api/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/topic/tasks/${userId}`, (message) => {
                const updatedTask = JSON.parse(message.body);
                setTasks((prev) => {
                    const exists = prev.find(t => t.id == updatedTask.id);
                    if (exists) {
                        return prev.map(t => t.id == updatedTask.id ? updatedTask : t);
                    } else {
                        return [...prev, updatedTask];
                    }
                });
            });
        };

        stompClient.activate();
        stompClientRef.current = stompClient;
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }
    };

    const handleSaveTask = async (formData) => {
        try {
            if (editingTask) {
                const updated = await apiClient.put(`/api/tasks/${editingTask.id}`, formData);
                setTasks(prev => prev.map(t => t.id == editingTask.id ? updated : t));
            } else {
                await apiClient.post('/api/tasks', { ...formData, status: modalCategory });
                // We DON'T update state here. We wait for the real-time broadcast.
            }
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (error) {
            console.error('Failed to save task:', error);
            alert('Error saving task. Please try again.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        // Optimistic delete
        const originalTasks = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== taskId));

        try {
            await apiClient.delete(`/api/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete failed:', error);
            setTasks(originalTasks);
            alert('Failed to delete task.');
        }
    };

    const openCreateModal = (category = 'TODO') => {
        setEditingTask(null);
        setModalCategory(category);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;
        const currentTask = tasks.find(t => t.id === taskId);

        if (currentTask && currentTask.status !== newStatus) {
            const oldStatus = currentTask.status;
            setTasks(prev => prev.map(t => 
                t.id == taskId ? { ...t, status: newStatus } : t
            ));

            try {
                await apiClient.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
            } catch (error) {
                console.error('Update failed:', error);
                setTasks(prev => prev.map(t => 
                    t.id == taskId ? { ...t, status: oldStatus } : t
                ));
            }
        }
    };

    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1rem 1rem 1rem' }}>
                <button 
                    className={styles.addColumnBtn} 
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                    onClick={() => openCreateModal()}
                >
                    <Plus size={18} /> Add Task
                </button>
            </div>
            <motion.div 
                className={styles.board}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {COLUMNS.map(col => (
                    <div key={col.id} className={styles.columnContainer} data-id={col.id}>
                        <div className={styles.columnHeader}>
                            <h3 className={styles.columnTitle}>
                                {col.title}
                                <span className={styles.count}>{tasks.filter(t => t.status === col.id).length}</span>
                            </h3>
                        </div>
                        <KanbanColumn 
                            id={col.id} 
                            tasks={tasks.filter(t => t.status === col.id)} 
                            onEditTask={openEditModal}
                            onDeleteTask={handleDeleteTask}
                        />
                    </div>
                ))}
                <DragOverlay>
                    {activeId ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>
            </motion.div>

            <TaskModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                onSave={handleSaveTask}
                task={editingTask}
                initialStatus={modalCategory}
            />
        </DndContext>
    );
}


