"use client"
import React, { useState, useEffect } from 'react';
import styles from "./Reminder.module.scss";


const Reminder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState([]);

  // Fetch reminders from backend
  const fetchReminders = async () => {
    try {
      const res = await fetch('http://localhost:8080/reminders');
      if (!res.ok) throw new Error('Failed to fetch reminders');
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      // Combine date and time into ISO-8601 string
      let isoDate = '';
      if (date && time) {
        isoDate = new Date(`${date}T${time}`).toISOString().slice(0, 16);
      } else if (date) {
        isoDate = new Date(date).toISOString().slice(0, 10);
      }
      const response = await fetch('http://localhost:8080/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          recurring,
          date: isoDate,
        }),
      });
      if (!response.ok) throw new Error('Failed to add reminder');
      setSuccess('Reminder added successfully!');
      setTitle('');
      setDescription('');
      setRecurring(false);
      setDate('');
      setTime('');
      fetchReminders();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["reminder-form"]}>
      <h2>Add Reminder</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Recurring:</label>
          <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Time:</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Reminder'}</button>
      </form>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <hr style={{margin: '2rem 0'}} />
      <h3>Reminders</h3>
      <ul>
        {reminders.length === 0 && <li>No reminders found.</li>}
        {reminders.map(reminder => (
          <li key={reminder.id} style={{marginBottom: '1rem'}}>
            <strong>{reminder.title}</strong>
            <div>{reminder.description}</div>
            <div>Recurring: {reminder.recurring ? 'Yes' : 'No'}</div>
            <div>Date: {reminder.date ? reminder.date : 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reminder;
