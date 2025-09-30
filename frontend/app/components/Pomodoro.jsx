"use client"
import React, { useState, useEffect } from "react";
import styles from "./Pomodoro.module.scss";

const API_URL = "http://localhost:8080/pomodoro";


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
  // Timer state
  const [timer, setTimer] = useState(25 * 60); // seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("work"); // work, short, long
  const [cyclesLeft, setCyclesLeft] = useState(4);

  const fetchPomodoros = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch pomodoros");
      const data = await res.json();
      setPomodoros(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPomodoros();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          // Timer finished
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

  // Handle timer end
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

  // Format timer
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Start/Pause/Reset
  const handleStart = () => setTimerRunning(true);
  const handlePause = () => setTimerRunning(false);
  const handleReset = () => {
    setTimer(form.durationMinutes * 60);
    setTimerMode("work");
    setCyclesLeft(form.cycles);
    setTimerRunning(false);
  };

  // Update timer when form changes
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
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          durationMinutes: Number(form.durationMinutes),
          shortBreakMinutes: Number(form.shortBreakMinutes),
          longBreakMinutes: Number(form.longBreakMinutes),
          cycles: Number(form.cycles),
        }),
      });
      if (!res.ok) throw new Error("Failed to add pomodoro");
      setSuccess("Pomodoro added!");
      setForm({ title: "", durationMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, cycles: 4 });
      fetchPomodoros();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pomodoroContainer}>
      <h2>Pomodoro</h2>
      <div className={styles.timerSection}>
        <div className={styles.timerLabel}>
          {timerMode === "work" ? "Work" : timerMode === "short" ? "Short Break" : "Long Break"}
        </div>
        <div className={styles.timerValue}>{formatTime(timer)}</div>
        <div className={styles.timerControls}>
          {timerRunning ? (
            <button className={styles.timerBtn} onClick={handlePause}>Pause</button>
          ) : (
            <button className={styles.timerBtn} onClick={handleStart}>Start</button>
          )}
          <button className={styles.timerBtn} onClick={handleReset}>Reset</button>
        </div>
        <div className={styles.cyclesInfo}>Cycles Left: {cyclesLeft}</div>
      </div>
      <form onSubmit={handleSubmit} className={styles.pomodoroForm}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="durationMinutes" type="number" min="1" value={form.durationMinutes} onChange={handleChange} placeholder="Duration (min)" required />
        <input name="shortBreakMinutes" type="number" min="1" value={form.shortBreakMinutes} onChange={handleChange} placeholder="Short Break (min)" required />
        <input name="longBreakMinutes" type="number" min="1" value={form.longBreakMinutes} onChange={handleChange} placeholder="Long Break (min)" required />
        <input name="cycles" type="number" min="1" value={form.cycles} onChange={handleChange} placeholder="Cycles" required />
        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Pomodoro"}</button>
      </form>
      {success && <div className={styles.success}>{success}</div>}
      {error && <div className={styles.error}>{error}</div>}
      <hr style={{margin: '2rem 0'}} />
      <h3>Pomodoro Sessions</h3>
      <ul>
        {pomodoros.length === 0 && <li>No pomodoros found.</li>}
        {pomodoros.map((p) => (
          <li key={p.id} className={styles.pomodoroItem}>
            <strong>{p.title}</strong> | {p.durationMinutes} min | Short Break: {p.shortBreakMinutes} min | Long Break: {p.longBreakMinutes} min | Cycles: {p.cycles} | Status: {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pomodoro;
