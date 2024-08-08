const express = require('express');
const notes = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readFiles, writeFiles, readAndFill } = require('../helpers/fsUtil.js');

// GET route to retrieve all notes
notes.get('/', async (_req, res) => {
    try {
        const data = await readFiles('./db/db/json');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to get notes' });
    }
})

//GET route for specific note
notes.get('/:note_id', async (req, res) => {
const noteID = req.params.note_id;
try {
    const data = await readFiles('./db/db/json');
    const notes= JSON.parse(data);
    const result = notes.find((note => note.id === noteID));
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ message: 'No note with that ID' });
    }
}catch (error) {
        res.status(500).json({ error: 'Failed to get note' });
    }
});

//Delete route for specific note
notes.delete('/:note_id', async (req, res) => {
    const noteID = req.params.note_id;
    try {
        const data = await readFiles('./db/db/json');
        const notes= JSON.parse(data);
        const result = notes.filter((note => note.id!== noteID));
        await writeFiles('./db/db/json', result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
})

// post routes for new note
notes.post('/', async (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
};
try {
    await readAndFill(newNote, './db/db/json');
        res.json({message: 'Note created!'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create new note' });
    }
} else {
    res.status(400).json({ message: 'Please provide both a title and text for the note' });
}

});

module.exports = notes;