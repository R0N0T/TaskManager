package com.example.taskmanager.controller;

import com.example.taskmanager.model.*;
import com.example.taskmanager.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/habits")
//@CrossOrigin(origins = "*") // Allow frontend access
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

