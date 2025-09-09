package com.example.taskmanager.repository;

import com.example.taskmanager.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

}
