package com.example.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReminderEvent {

    @JsonProperty("reminderId")
    private Long reminderId;

    @JsonProperty("taskId")
    private Long taskId;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("taskTitle")
    private String taskTitle;

    @JsonProperty("reminderType")
    private String reminderType; // "email" or "in-app"

    @JsonProperty("dueDate")
    private LocalDateTime dueDate;

    @JsonProperty("userEmail")
    private String userEmail;

    @JsonProperty("status")
    private String status; // "pending", "sent", "failed"

}
