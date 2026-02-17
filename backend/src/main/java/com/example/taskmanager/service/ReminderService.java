package com.example.taskmanager.service;

import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public Reminder addReminder(Reminder reminder) {
        if (reminder.getStatus() == null) {
            reminder.setStatus("pending");
        }
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public List<Reminder> getRemindersByUserAndStatus(Long userId, String status) {
        return reminderRepository.findByUserIdAndStatus(userId, status);
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }

    public Reminder updateReminder(Long id, Reminder reminderDetails) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id " + id));

        reminder.setTitle(reminderDetails.getTitle());
        reminder.setDescription(reminderDetails.getDescription());
        reminder.setDate(reminderDetails.getDate());
        reminder.setTaskId(reminderDetails.getTaskId());
        reminder.setUserId(reminderDetails.getUserId());
        reminder.setUserEmail(reminderDetails.getUserEmail());
        reminder.setReminderType(reminderDetails.getReminderType());

        if (reminderDetails.getStatus() != null) {
            reminder.setStatus(reminderDetails.getStatus());
        }

        return reminderRepository.save(reminder);
    }
}
