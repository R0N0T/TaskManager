"use client"
import React, { useState, useEffect } from 'react';
import styles from "./Reminder.module.scss";
import { apiClient } from '../utils/apiClient';


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
      const data = await apiClient.get('/reminders');
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setReminders([]);
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
      // Validate that selected date and time are in the future
      const selectedDateTime = new Date(`${date}T${time}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        setError('Please select a future date and time');
        setLoading(false);
        return;
      }

      // Combine date and time into ISO-8601 string
      const isoDate = selectedDateTime.toISOString().slice(0, 16);
      await apiClient.post('/reminders', {
        title,
        description,
        recurring,
        date: isoDate,
      });
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
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required 
          />
        </div>
        <div>
          <label>Time:</label>
          <input 
            type="time" 
            value={time} 
            onChange={e => {
              const selectedDateTime = new Date(`${date}T${e.target.value}`);
              const now = new Date();
              
              // If selected date is today, ensure time is in the future
              if (date === now.toISOString().split('T')[0] && selectedDateTime <= now) {
                setError('Please select a future time');
                return;
              }
              
              setError(null);
              setTime(e.target.value);
            }}
            min={date === new Date().toISOString().split('T')[0] ? 
              new Date().toTimeString().slice(0, 5) : 
              undefined}
            required 
          />
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
