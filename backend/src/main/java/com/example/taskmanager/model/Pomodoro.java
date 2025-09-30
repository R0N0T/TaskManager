package com.example.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pomodoro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;
    private Integer durationMinutes=25;
    private Integer shortBreakMinutes=5;
    private Integer longBreakMinutes=15;
    private Integer cycles=4;
    private Integer currentCycles=0;

    @Enumerated(EnumType.STRING)
    private PomodoroStatus status = PomodoroStatus.RUNNING;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
