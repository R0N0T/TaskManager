"use client";
import Pomodoro from '../../components/Pomodoro';

export default function PomodoroPage() {
  return (
    <div className="page-container" style={{ paddingTop: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Focus Timer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Use the Pomodoro technique to boost productivity.</p>
      </div>
      <Pomodoro />
    </div>
  );
}