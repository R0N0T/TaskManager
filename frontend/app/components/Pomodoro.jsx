"use client"
import React, { useState, useEffect } from "react";
import styles from "./Pomodoro.module.scss";
import { apiClient } from "../utils/apiClient";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";

const Pomodoro = () => {
  const [pomodoros, setPomodoros] = useState([]);
  const [form, setForm] = useState({
    title: "",
    durationMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cycles: 4,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timer, setTimer] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("work");
  const [cyclesLeft, setCyclesLeft] = useState(4);

  const fetchPomodoros = async () => {
    try {
      const data = await apiClient.get('/api/pomodoro');
      setPomodoros(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPomodoros();
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          handleTimerEnd();
          return 0;
        });
      }, 1000);
    } else if (!timerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timerRunning, timer]);

  const handleTimerEnd = () => {
    if (timerMode === "work") {
      if (cyclesLeft > 1) {
        setTimerMode("short");
        setTimer(form.shortBreakMinutes * 60);
        setCyclesLeft((c) => c - 1);
      } else {
        setTimerMode("long");
        setTimer(form.longBreakMinutes * 60);
        setCyclesLeft(form.cycles);
      }
    } else {
      setTimerMode("work");
      setTimer(form.durationMinutes * 60);
    }
    setTimerRunning(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleStart = () => setTimerRunning(true);
  const handlePause = () => setTimerRunning(false);
  const handleReset = () => {
    setTimer(form.durationMinutes * 60);
    setTimerMode("work");
    setCyclesLeft(form.cycles);
    setTimerRunning(false);
  };

  useEffect(() => {
    setTimer(form.durationMinutes * 60);
    setCyclesLeft(form.cycles);
    setTimerMode("work");
    setTimerRunning(false);
  }, [form.durationMinutes, form.cycles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiClient.post('/api/pomodoro', {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        shortBreakMinutes: Number(form.shortBreakMinutes),
        longBreakMinutes: Number(form.longBreakMinutes),
        cycles: Number(form.cycles),
      });
      setSuccess("Pomodoro added!");
      setForm({ title: "", durationMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, cycles: 4 });
      fetchPomodoros();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SVG circular progress
  const totalSeconds = timerMode === "work"
    ? form.durationMinutes * 60
    : timerMode === "short"
    ? form.shortBreakMinutes * 60
    : form.longBreakMinutes * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - timer) / totalSeconds : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const modeLabel = timerMode === "work" ? "Focus" : timerMode === "short" ? "Short Break" : "Long Break";
  const modeColor = timerMode === "work" ? "var(--accent-primary)" : timerMode === "short" ? "var(--success)" : "var(--warning)";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pomodoro</h2>

      <div className={styles.timerSection}>
        <div className={styles.timerRing}>
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle
              cx="130" cy="130" r={radius}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="6"
            />
            <circle
              cx="130" cy="130" r={radius}
              fill="none"
              stroke={modeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 130 130)"
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div className={styles.timerContent}>
            <span className={styles.modeLabel} style={{ color: modeColor }}>{modeLabel}</span>
            <span className={styles.timerValue}>{formatTime(timer)}</span>
          </div>
        </div>
        <span className={styles.cyclesInfo}>Cycle {form.cycles - cyclesLeft + 1} of {form.cycles}</span>

        <div className={styles.timerControls}>
          {timerRunning ? (
            <button className={styles.controlBtn} onClick={handlePause}>
              <Pause size={20} /> Pause
            </button>
          ) : (
            <button className={`${styles.controlBtn} ${styles.primary}`} onClick={handleStart}>
              <Play size={20} /> Start
            </button>
          )}
          <button className={styles.controlBtn} onClick={handleReset}>
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>New Session</h3>
        <form onSubmit={handleSubmit} className={styles.pomodoroForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Session name" required />
            </div>
            <div className={styles.formGroup}>
              <label>Duration (min)</label>
              <input name="durationMinutes" type="number" min="1" value={form.durationMinutes} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Short Break</label>
              <input name="shortBreakMinutes" type="number" min="1" value={form.shortBreakMinutes} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Long Break</label>
              <input name="longBreakMinutes" type="number" min="1" value={form.longBreakMinutes} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Cycles</label>
              <input name="cycles" type="number" min="1" value={form.cycles} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            <Plus size={16} /> {loading ? "Adding..." : "Add Session"}
          </button>
        </form>
        {success && <div className={styles.success}>{success}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {pomodoros.length > 0 && (
        <div className={styles.sessionsSection}>
          <h3 className={styles.sectionTitle}>Sessions</h3>
          <div className={styles.sessionsList}>
            {pomodoros.map((p) => (
              <div key={p.id} className={styles.sessionCard}>
                <div className={styles.sessionHeader}>
                  <strong>{p.title}</strong>
                  <span className={styles.sessionStatus}>{p.status}</span>
                </div>
                <div className={styles.sessionMeta}>
                  <span>{p.durationMinutes}min</span>
                  <span>·</span>
                  <span>{p.cycles} cycles</span>
                  <span>·</span>
                  <span>{p.shortBreakMinutes}/{p.longBreakMinutes}min breaks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
