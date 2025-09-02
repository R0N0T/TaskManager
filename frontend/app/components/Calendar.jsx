import React, { useEffect, useState } from "react";
import "./Calendar.scss";

const Calendar = ({ habitId, completions }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // which weekday month starts on
  const [toggledDay, setToggledday] = useState("");
  const [completedDays, setCompletedDays] = useState(new Set());

  const toggleDay = (day) => {
    setToggledday(`${day}`);
    const newCompleted = new Set(completedDays);
    if (newCompleted.has(day)) {
      newCompleted.delete(day); // unmark
    } else {
      newCompleted.add(day); // mark
    }
    setCompletedDays(newCompleted);
  };
  useEffect(() => {
    if (completions && completions.length > 0) {
      const days = completions.map((c) => new Date(c.date).getDate());
      setCompletedDays(new Set(days));
    }
  }, []);
  useEffect(() => {
    const toggleHabit = async () => {
      try {
        const formattedDay = String(toggledDay).padStart(2, "0");
        const formattedMonth = String(month + 1).padStart(2, "0");

        const response = await fetch(
          `http://localhost:8080/habits/${habitId}/toggle?date=${year}-${formattedMonth}-${formattedDay}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response?.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response?.json();
      } catch (error) {
        console.error("Error toggling habit:", error);
      }
    };

    if (completedDays.size > 0) {
      toggleHabit();
    }
  }, [completedDays]);

  return (
    <div className="calendar">
      <div className="header">
        <h2>
          {today.toLocaleString("default", { month: "long" })} {year}
        </h2>
      </div>

      {/* Weekday labels */}
      <div className="weekdays">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="days">
        {/* Empty slots before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isCompleted = completedDays.has(day);
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className={`day ${isCompleted ? "completed" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => toggleDay(day)}
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
