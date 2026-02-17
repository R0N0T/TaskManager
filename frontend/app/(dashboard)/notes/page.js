"use client";
import Notes from '../../components/Notes';

export default function NotesPage() {
  return (
    <div className="page-container" style={{ paddingTop: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Notes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Jot down ideas and keep them organized.</p>
      </div>
      <Notes />
    </div>
  );
}
