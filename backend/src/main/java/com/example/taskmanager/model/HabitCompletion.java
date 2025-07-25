package com.example.taskmanager.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Entity
public class HabitCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private LocalDate date;

    @Setter
    @ManyToOne
    @JoinColumn(name = "habit_id")
    private Habit habit;

    // ✅ Getters & Setters

}
