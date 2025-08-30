package com.example.taskmanager.controller;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.taskmanager.model.*;
import com.example.taskmanager.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/habits")
public class HabitController {

    private final HabitRepository habitRepo;
    private final HabitCompletionRepository completionRepo;

    public HabitController(HabitRepository habitRepo, HabitCompletionRepository completionRepo) {
        this.habitRepo = habitRepo;
        this.completionRepo = completionRepo;
    }

    @GetMapping
    public List<Habit> getAllHabits() {
        return habitRepo.findAll();
    }

    @GetMapping("/{id}/completions")
    public List<LocalDate> getHabitCompletions(@PathVariable Long id) {
        Habit habit = habitRepo.findById(id).orElseThrow();
        return habit.getCompletions().stream().map(HabitCompletion::getDate).toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHabit(@PathVariable Long id, @RequestBody Habit updatedHabit) {
        Optional<Habit> optionalHabit = habitRepo.findById(id);

        if (optionalHabit.isPresent()) {
            Habit habit = optionalHabit.get();
            habit.setName(updatedHabit.getName());
            habitRepo.save(habit);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Habit updated successfully");
            response.put("habit", habit);
            return ResponseEntity.ok(response);

        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Habit not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteHabit(@PathVariable Long id) {
        Habit habit = habitRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habit not found"));
        habitRepo.delete(habit);
    }

    @PostMapping
    public Habit createHabit(@RequestBody Habit habit) {
        return habitRepo.save(habit);
    }

    @PostMapping("/{id}/toggle")
    public void toggleCompletion(@PathVariable Long id, @RequestParam String date) {
        Habit habit = habitRepo.findById(id).orElseThrow();
        LocalDate parsedDate = LocalDate.parse(date);

        Optional<HabitCompletion> existing = completionRepo.findByHabitAndDate(habit, parsedDate);
        if (existing.isPresent()) {
            completionRepo.delete(existing.get()); // unmark
        } else {
            HabitCompletion completion = new HabitCompletion();
            completion.setHabit(habit);
            completion.setDate(parsedDate);
            completionRepo.save(completion); // mark
        }
    }
}

