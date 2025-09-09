package com.example.taskmanager.controller;

import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @GetMapping
    public List<Reminder> reminders() {
        return reminderService.getAllReminders();
    }

    @PostMapping
    public Reminder addReminder(@RequestBody Reminder reminder) {
        return reminderService.addReminder(reminder);
    }

    @DeleteMapping("/{id}")
    public void deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
    }
}
