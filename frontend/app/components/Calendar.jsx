import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.scss";
import { apiClient } from '../utils/apiClient';

const Calendar = ({ habitId, completions }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const [toggledDate, setToggledDate] = useState("");
  const [completedDates, setCompletedDates] = useState(new Set());

  const toggleDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setToggledDate(dateStr);
    const newCompleted = new Set(completedDates);
    if (newCompleted.has(dateStr)) {
      newCompleted.delete(dateStr); // unmark
    } else {
      newCompleted.add(dateStr); // mark
    }
    setCompletedDates(newCompleted);
  };
  useEffect(() => {
    if (completions && completions.length > 0) {
      const dates = completions.map((c) => {
        const date = new Date(c.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      });
      setCompletedDates(new Set(dates));
    }
  }, []);
  useEffect(() => {
    const toggleHabit = async () => {
      try {
        if (!toggledDate) return;

        await apiClient.post(
          `/habits/${habitId}/toggle?date=${toggledDate}`
        );

        if (!response?.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response?.json();
      } catch (error) {
        console.error("Error toggling habit:", error);
      }
    };

    if (toggledDate) {
      toggleHabit();
    }
  }, [completedDates]);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button 
          className={styles.navButton}
          onClick={() => {
            const newDate = new Date(year, month - 1);
            setCurrentDate(newDate);
          }}
        >
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button 
          className={styles.navButton}
          onClick={() => {
            const newDate = new Date(year, month + 1);
            if (newDate <= today) {
              setCurrentDate(newDate);
            }
          }}
          disabled={new Date(year, month + 1) > today}
        >
          &gt;
        </button>
      </div>

      {/* Weekday labels */}
      <div className={styles.weekdays}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className={styles.days}>
        {/* Empty slots before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.emptyDay} />
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isCompleted = completedDates.has(dateStr);
          const currentDateObj = new Date(year, month, day);
          const isToday = currentDateObj.toDateString() === today.toDateString();
          const isFutureDate = currentDateObj > today;
          const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                               currentDate.getFullYear() === today.getFullYear();

          return (
            <div
              key={day}
              className={`${styles.day} 
                ${isCompleted ? styles.completed : ""} 
                ${isToday ? styles.today : ""} 
                ${isFutureDate ? styles.future : ""}`}
              onClick={() => {
                if (!isFutureDate) {
                  toggleDay(day);
                }
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
