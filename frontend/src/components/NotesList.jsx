import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotesList({ userId }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    if (!userId) {
      setError("User ID is required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/notes?userId=${userId}`
      );
      if (!response.ok) {
        setError(`Failed: ${response.status} ${response.statusText}`);
        setNotes([]);
        return;
      }

      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError("Error");
      setNotes([]);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.content) {
      setError("Title and content are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newNote, userId }),
      });

      if (!response.ok) {
        setError(`Failed: ${response.status} ${response.statusText}`);
        return;
      }

      const addedNote = await response.json();
      setNotes((prevNotes) => [...prevNotes, addedNote]);
      setNewNote({ title: "", content: "" });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError("Error");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError(`Failed: ${response.status} ${response.statusText}`);
        return;
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setError(null);
    } catch (err) {
      setError("Error");
    }
  };

  const handleEditNote = async (id, updatedNote) => {
    try {
      const response = await fetch(`http://localhost:5000/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        setError(`Failed: ${response.status} ${response.statusText}`);
        return;
      }

      const updatedNoteData = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNoteData._id ? updatedNoteData : note
        )
      );
      setError(null);
    } catch (err) {
      setError("Error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");

    navigate("/login");
  };

  return (
    <div className="notes_list">
      <h1 className="header">My Notes</h1>

      <button
        className="add_button"
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        {showAddForm ? "Close" : "Add Note"}
      </button>

      {showAddForm && (
        <div className="form">
          <input
            className="input"
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea
            className="input"
            placeholder="Content"
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
          />
          <button className="save_button" onClick={handleAddNote}>
            Save
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="my_notes">
        {notes.length > 0 ? (
          notes.map((note) => (
            <EditableNote
              key={note._id}
              note={note}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
            />
          ))
        ) : (
          <p className="nothing">Add notes!</p>
        )}
      </div>
      <button className="logout_button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

function EditableNote({ note, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
  });

  const handleSave = () => {
    onEdit(note._id, editedNote);
    setIsEditing(false);
  };

  return (
    <div className="note">
      {isEditing ? (
        <>
          <input
            className="input"
            type="text"
            value={editedNote.title}
            onChange={(e) =>
              setEditedNote({ ...editedNote, title: e.target.value })
            }
          />
          <textarea
            className="input"
            value={editedNote.content}
            onChange={(e) =>
              setEditedNote({ ...editedNote, content: e.target.value })
            }
          />
          <button className="save_button" onClick={handleSave}>
            Save
          </button>
        </>
      ) : (
        <>
          <h2 className="note_title">{note.title}</h2>
          <p className="note_content">{note.content}</p>
          <button className="edit_button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="delete_button" onClick={() => onDelete(note._id)}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default NotesList;
