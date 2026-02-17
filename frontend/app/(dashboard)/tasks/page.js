"use client";
import TaskManager from '../../components/TaskManager';

export default function TasksPage() {
  return (
    <div className="page-container" style={{ paddingTop: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Tasks & Habits</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your daily progress and long-term goals.</p>
      </div>
      <TaskManager />
    </div>
  );
}