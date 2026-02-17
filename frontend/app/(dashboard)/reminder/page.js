"use client";
import Reminder from '../../components/Reminder';

export default function ReminderPage() {
  return (
    <div className="page-container" style={{ paddingTop: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Reminders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Stay on top of your schedule.</p>
      </div>
      <Reminder />
    </div>
  );
}