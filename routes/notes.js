const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFiles, writeFiles, readAndFill } = require('../helpers/fsUtils');
const path = require('path');

// GET route to retrieve all notes
notes.get('/api/notes', (_req, res) => {
    readFiles(path.join(__dirname,'../db/db.json')).then((data) => res.json(JSON.parse(data)));
});

// //GET route for specific note
// notes.get('/api/notes', (req, res) => {
// const noteID = req.params.note_id;
// readFiles('./db/db.json')
// .then ((data) => JSON.parse(data))
// .then((json) => {
//     const result = json.filter((note) => note.note_id === noteID);
//     return result.length > 0
// ? res.json(result)
// : res.json('No note with that ID');
// });
// });

//Delete route for specific note
notes.delete('/api/notes/:note_id', (req, res) => {
    console.info(req.params);
    const noteID = req.params.note_id;
    console.info(noteID);

    //New array for notes except the id in url
    const result = json.filter((note) => note.id !== noteID);

    //Save the array
    writeFiles(path.join(__dirname,'../db/db.json'), result);
    res.json(`This note ${noteID} has been deleted`);
});

   

// post routes for new note
notes.post('/api/notes', (req, res) => {
    console.log(req.body);

        const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
};
        readAndFill(newNote,(path.join(__dirname, '../db/db.json')));
        res.json(`Note added!`);
} else {
    res.errored('Error in adding note');
}

});

module.exports = notes;