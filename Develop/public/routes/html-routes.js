const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.get('/notes', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

module.exports = router;