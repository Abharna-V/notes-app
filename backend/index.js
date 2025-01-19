const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/NotesList", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});

const Note = mongoose.model("Note", noteSchema);

app.get("/notes", async (req, res) => {
  const { userId } = req.query; 
  try {
    const notes = await Note.find({ userId }); 
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.post("/notes", async (req, res) => {
  const { title, content, userId } = req.body;
  try {
    const note = new Note({ title, content, userId }); 
    const savedNote = await note.save(); 
    res.status(201).json(savedNote); 
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await Note.findByIdAndDelete(id); 
    if (!deletedNote) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true } 
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json(updatedNote); 
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Running!");
});

app.post("/logout", (req, res) => {

  res.status(200).json({ message: "Log out successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
