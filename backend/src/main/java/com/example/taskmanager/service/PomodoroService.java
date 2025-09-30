package com.example.taskmanager.service;

import com.example.taskmanager.model.Pomodoro;
import com.example.taskmanager.repository.PomodoroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PomodoroService {

    @Autowired
    private PomodoroRepository pomodoroRepository;

    public List<Pomodoro> getAllPomodoros() {
        return pomodoroRepository.findAll();
    }

    public Pomodoro addPomodoro(Pomodoro pomodoro) {
        return pomodoroRepository.save(pomodoro);
    }

    public Pomodoro updatePomodoro(Pomodoro pomodoro) {
        return pomodoroRepository.save(pomodoro);
    }

    public void deletePomodoro(Long Id) {
        pomodoroRepository.deleteById(Id);
    }
}
