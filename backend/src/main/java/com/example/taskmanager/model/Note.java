package com.example.taskmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID
    private Integer noteId;

    @Column(nullable = false) // Title should probably not be empty
    private String noteTitle;

    @Column(length = 5000) // Increase length if content is long (default is usually 255)
    private String noteContent;
}