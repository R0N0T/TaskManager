package com.example.taskmanager.controller;

import com.example.taskmanager.model.Pomodoro;
import com.example.taskmanager.service.PomodoroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PomodoroController {

    @Autowired
    private PomodoroService pomodoroService;

    @GetMapping({"/pomodoro"})
    public List<Pomodoro> getPomodoro() {
        return pomodoroService.getAllPomodoros();
    }

    @PostMapping({"/pomodoro"})
    public Pomodoro addPomodoro(@RequestBody Pomodoro pomodoro) {
        return pomodoroService.addPomodoro(pomodoro);
    }

    @PutMapping({"/pomodoro"})
    public Pomodoro updatePomodoro(@RequestBody Pomodoro pomodoro) {
        return pomodoroService.updatePomodoro(pomodoro);
    }

    @DeleteMapping({"/pomodoro/{id}"})
    public void deletePomodoro(@PathVariable Long id) {
        pomodoroService.deletePomodoro(id);
    }
}
