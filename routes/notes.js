const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFiles, writeFiles, readAndFill } = require('../helpers/fsUtils');
const path = require('path');

// GET route to retrieve all notes
notes.get('/api/notes', (_req, res) => {
    readFiles(path.join(__dirname, '../db/db.json'))
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
        console.error('Error reading the file:', err);
        res.status(500).json('Error reading the notes');
    });
});

// Delete route for specific note
notes.delete('/api/notes/:note_id', (req, res) => {
    const noteID = req.params.note_id;

    readFiles(path.join(__dirname, '../db/db.json'))
        .then((data) => {
            const notesArray = JSON.parse(data);
            const updatedNotes = notesArray.filter((note) => note.id !== noteID);

            return writeFiles(path.join(__dirname, '../db/db.json'), JSON.stringify(updatedNotes, null, 2))
                .then(() => {
                    res.json(`This note ${noteID} has been deleted`);
                })
                .catch((err) => {
                    console.error('Error writing to file:', err);
                    res.status(500).json('Error deleting the note');
                });
        })
        .catch((err) => {
            console.error('Error reading the file:', err);
            res.status(500).json('Error reading the notes');
        })
});

// POST route
notes.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndFill(newNote, path.join(__dirname, '../db/db.json'))
        .then(() => res.json(`Note added!`))
        .catch((err) => {
            console.error('Error writing to file:', err);
            res.status(500).json('Error adding the note');
        });
    } else {
        res.status(400).json('please enter both title and text');
    }
});

module.exports = notes;