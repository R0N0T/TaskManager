package com.example.taskmanager.controller;

import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Reminder> reminders(Authentication authentication) {
        if (authentication == null)
            return reminderService.getAllReminders();

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user != null) {
            // "Upcoming" reminders = pending status
            return reminderService.getRemindersByUserAndStatus(user.getId(), "pending");
        }

        return reminderService.getAllReminders();
    }

    @PostMapping
    public Reminder addReminder(@RequestBody Reminder reminder, Authentication authentication) {
        if (authentication != null) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            reminder.setUserId(user.getId());
            reminder.setUserEmail(username); // fallback if email is same as username
        }
        return reminderService.addReminder(reminder);
    }

    @PutMapping("/{id}")
    public Reminder updateReminder(@PathVariable Long id, @RequestBody Reminder reminder) {
        return reminderService.updateReminder(id, reminder);
    }

    @DeleteMapping("/{id}")
    public void deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
    }
}
