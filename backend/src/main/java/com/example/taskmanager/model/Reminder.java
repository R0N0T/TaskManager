package com.example.taskmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime date;
    private Boolean recurring;
    private String daysOfWeek; // Comma-separated: "MON,TUE,WED"

    // New fields for Kafka notification system
    private Long taskId;
    private Long userId;
    private String userEmail;
    private String reminderType; // "email" or "in-app"
    private String status; // "pending", "sent", "failed"

}
