package com.example.taskmanager.controller;

import com.example.taskmanager.model.Pomodoro;
import com.example.taskmanager.service.PomodoroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {

    @Autowired
    private PomodoroService pomodoroService;

    @GetMapping
    public List<Pomodoro> getPomodoro() {
        return pomodoroService.getAllPomodoros();
    }

    @PostMapping
    public Pomodoro addPomodoro(@RequestBody Pomodoro pomodoro) {
        return pomodoroService.addPomodoro(pomodoro);
    }

    @PutMapping
    public Pomodoro updatePomodoro(@RequestBody Pomodoro pomodoro) {
        return pomodoroService.updatePomodoro(pomodoro);
    }

    @DeleteMapping("/{id}")
    public void deletePomodoro(@PathVariable Long id) {
        pomodoroService.deletePomodoro(id);
    }
}
