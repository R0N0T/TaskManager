package com.example.taskmanager.service;

import com.example.taskmanager.model.NylasMessage;
import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public Reminder addReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }

    public Reminder updateReminder(Long id, Reminder reminderDetails) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id " + id));

        reminder.setTitle(reminderDetails.getTitle());
        reminder.setDescription(reminderDetails.getDescription());

        return reminderRepository.save(reminder);
    }

    public Long UTCtoUnix(LocalDateTime utcTime) {
        // Add 5 minutes
        LocalDateTime updatedTime = utcTime.plusMinutes(5);

        // Convert to Unix timestamp
        return updatedTime.toEpochSecond(ZoneOffset.UTC);
    }


}
