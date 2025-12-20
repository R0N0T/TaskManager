package com.example.taskmanager.controller;

import com.example.taskmanager.model.NylasMessage;
import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.service.NylasService;
import com.example.taskmanager.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;


    @Autowired
    private NylasService nylasService;

    @GetMapping
    public List<Reminder> reminders() {
        return reminderService.getAllReminders();
    }

    @PostMapping
    public Reminder addReminder(@RequestBody Reminder reminder) {

        Long unixTimestamp = reminderService.UTCtoUnix(reminder.getDate());

        List<NylasMessage.Recipient> recipients = List.of(
                new NylasMessage.Recipient("Leyah Miller", "rohit.rkt7398@gmail.com")
        );
        NylasMessage message = new NylasMessage(
                recipients,
                "Your Subject Here",
                "Your email body here",
                unixTimestamp
        );

        nylasService.sendMessage("unixTimestamp",message);
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
