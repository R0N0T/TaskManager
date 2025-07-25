package com.example.taskmanager.repository;

import com.example.taskmanager.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit, Long> {
}

