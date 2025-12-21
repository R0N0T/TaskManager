"use client";
import React, { useEffect, useState } from "react";
import styles from "./Notes.module.scss";
import { apiClient } from "../utils/apiClient";

const API_BASE = "http://localhost:8080/notes";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ noteTitle: "", noteContent: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotes = async () => {
    try {
      const data = await apiClient.get("/notes");
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.noteTitle.trim() || !form.noteContent.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/notes/${editingId}`, form);
      } else {
        await apiClient.post("/notes", form);
      }
      setForm({ noteTitle: "", noteContent: "" });
      setEditingId(null);
      setSearchTerm("");
      await fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await apiClient.delete(`/notes/${id}`);
        setNotes((prevNotes) => prevNotes.filter((note) => note.noteId !== id));
        setSearchTerm("");
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleEdit = (note) => {
    setForm({ noteTitle: note.noteTitle, noteContent: note.noteContent });
    setEditingId(note.noteId);
  };

  const handleCancel = () => {
    setForm({ noteTitle: "", noteContent: "" });
    setEditingId(null);
  };

  const filteredNotes = notes.filter((note) => {
    if (!searchTerm.trim()) {
      return true;
    }
    const searchLower = searchTerm.toLowerCase();
    return (
      (note.noteTitle &&
        note.noteTitle.toLowerCase().includes(searchLower)) ||
      (note.noteContent &&
        note.noteContent.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notes</h2>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="noteTitle"
          placeholder="Note Title"
          value={form.noteTitle}
          onChange={handleChange}
          required
          className={styles.titleInput}
        />
        <textarea
          name="noteContent"
          placeholder="Write your note here..."
          value={form.noteContent}
          onChange={handleChange}
          required
          className={styles.contentInput}
          rows="6"
        />
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            {editingId ? "Update Note" : "Add Note"}
          </button>
          {editingId && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.notesList}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note.noteId} className={styles.noteCard}>
              <div className={styles.noteHeader}>
                <h3>{note.noteTitle}</h3>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(note)}
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(note.noteId)}
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className={styles.noteContent}>{note.noteContent}</p>
              {note.createdAt && (
                <span className={styles.timestamp}>
                  {new Date(note.createdAt).toLocaleDateString()}{" "}
                  {new Date(note.createdAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>
            No notes yet. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
