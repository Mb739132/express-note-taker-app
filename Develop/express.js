const express = require('express');
const fs = require('fs').promises;  // Use fs.promises for async file operations
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = JSON.parse(await fs.readFile('db.json', 'utf8'));
    res.json(notes);
  } catch (error) {
    console.error('Error reading db.json:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };

    const notes = JSON.parse(await fs.readFile('db.json', 'utf8'));
    notes.push(newNote);
    
    await fs.writeFile('db.json', JSON.stringify(notes));
    res.json(newNote);
  } catch (error) {
    console.error('Error writing to db.json:', error);
    res.status(500).send('Internal Server Error');
  }
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
