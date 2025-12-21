package com.example.taskmanager.service;

import com.example.taskmanager.model.Note;
import com.example.taskmanager.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Note> findAll() {
        return noteRepository.findAll();
    }

    public Note findById(int id) {
        return noteRepository.findById(id).orElse(null);
    }

    public Note save(Note note) {
        return noteRepository.save(note);
    }

    public Note update(Note note) {
        return noteRepository.save(note);
    }

    public void delete(int id) {
        noteRepository.deleteById(id);
    }
}
