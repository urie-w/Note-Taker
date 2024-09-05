const express = require('express');
const path = require('path');
// const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/html-routes');
const notesRoutes = require('./routes/notes');
const PORT = process.env.PORT || 3001;

const app = express();

// Run in this order
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

  //Routes
  app.use(htmlRoutes);
  app.use(notesRoutes);


  app.listen(PORT, () => {
    console.log(`Server now on port http;//localhost:${PORT}!`);
  });