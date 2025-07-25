package com.example.taskmanager.repository;

import com.example.taskmanager.model.Habit;
import com.example.taskmanager.model.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    Optional<HabitCompletion> findByHabitAndDate(Habit habit, LocalDate date);
}

