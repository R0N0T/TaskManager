"use client"
import React, { useState, useEffect } from 'react';
import styles from "./Reminder.module.scss";
import { apiClient } from '../utils/apiClient';
import { Plus, Bell, Calendar, Clock, Repeat, Trash2 } from 'lucide-react';

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
      const selectedDateTime = new Date(`${date}T${time}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        setError('Please select a future date and time');
        setLoading(false);
        return;
      }

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
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reminders</h2>

      <div className={styles.formCard}>
        <h3 className={styles.sectionTitle}>New Reminder</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What to remember?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add details (optional)" rows="3" />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label><Calendar size={13} /> Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><Clock size={13} /> Time</label>
              <input
                type="time"
                value={time}
                onChange={e => {
                  const selectedDateTime = new Date(`${date}T${e.target.value}`);
                  const now = new Date();
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
          </div>
          <div className={styles.toggleRow}>
            <label className={styles.toggleLabel}>
              <Repeat size={14} />
              <span>Recurring</span>
            </label>
            <button
              type="button"
              className={`${styles.toggle} ${recurring ? styles.toggleActive : ''}`}
              onClick={() => setRecurring(!recurring)}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            <Plus size={16} /> {loading ? 'Adding...' : 'Add Reminder'}
          </button>
        </form>
        {success && <div className={styles.success}>{success}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {reminders.length > 0 && (
        <div className={styles.remindersList}>
          <h3 className={styles.sectionTitle}>Upcoming</h3>
          {reminders.map((reminder, index) => (
            <div key={reminder.id} className={styles.reminderCard} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className={styles.reminderIcon}>
                <Bell size={16} />
              </div>
              <div className={styles.reminderContent}>
                <strong>{reminder.title}</strong>
                {reminder.description && <p>{reminder.description}</p>}
                <div className={styles.reminderMeta}>
                  <span><Calendar size={12} /> {formatDate(reminder.date)}</span>
                  <span><Clock size={12} /> {formatTime(reminder.date)}</span>
                  {reminder.recurring && <span className={styles.recurringBadge}><Repeat size={11} /> Recurring</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reminders.length === 0 && (
        <div className={styles.emptyState}>
          <Bell size={32} />
          <p>No reminders yet</p>
        </div>
      )}
    </div>
  );
};

export default Reminder;
