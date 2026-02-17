package com.example.taskmanager.controller;

import com.example.taskmanager.model.Note;
import com.example.taskmanager.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes") // Sets the base path for ALL methods to "/api/notes"
public class NoteController {

    private final NoteService noteService;

    // Constructor Injection (Best Practice)
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        // Returns status 200 OK with the list
        return new ResponseEntity<>(noteService.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        // Returns status 201 CREATED (standard for successful POST)
        return new ResponseEntity<>(noteService.save(note), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Integer id, @RequestBody Note note) {
        // Ensure the ID in the path matches the object
        Note existingNote = noteService.findById(id);
        if (existingNote == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Explicitly set the ID to ensure we update, not create new
        note.setNoteId(id);
        return new ResponseEntity<>(noteService.update(note), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Integer id) {
        // FAILURE: ID not found
        if (noteService.findById(id) == null) {
            return ResponseEntity.notFound().build(); // Returns 404
        }

        noteService.delete(id);

        // SUCCESS: Deleted successfully
        return ResponseEntity.noContent().build(); // Returns 204
    }
}