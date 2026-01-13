package com.example.taskmanager.repository;

import com.example.taskmanager.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    /**
     * Find all reminders with given status that are due (date is before or equal to now)
     */
    @Query("SELECT r FROM Reminder r WHERE r.status = :status AND r.date <= :now")
    List<Reminder> findByStatusAndDateBefore(@Param("status") String status, @Param("now") LocalDateTime now);

}
