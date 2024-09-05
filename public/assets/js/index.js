let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');  
  noteList = document.querySelectorAll('.list-group');
}


// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

//get and render notes
const getAndRenderNotes = async () => {
  const notes = await getNotes();
  renderNoteList(notes);
};

//Get notes from server
const getNotes = async() => {
  const response = await fetch('/api/notes');
  const notes = await response.json();
  return notes;
};

//Saves new note
const saveNote = async (note) => {
  await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note),
  });
  getAndRenderNotes();
};

//Deletes note
const deleteNote = async (id) => {
  await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  getAndRenderNotes();
};


//Render the current note
const renderActiveNote = async() => {
  hide(saveNoteBtn);
  hide(clearBtn);
  
  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

//Note Save
const handleNoteSave = async() => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    renderActiveNote();
  });
};

// Delete the clicked note
// Prevents the click listener for the list from being called when the button inside of it is clicked
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteData = note.parentElement.getAttribute('data-note');
  
  
  if (!noteData) {
    console.error('No note found');
    return;
  }

const noteId = JSON.parse(noteData).id;
if (activeNote && activeNote.id === noteId) {
  activeNote = {};
}
deleteNote(noteId).then(() => {
  renderActiveNote();
});
};

//Side Bars list rendered
const renderNoteList = async (notes) => {
  noteList.innerHTML = '';

  let noteListItems = [];

  const createList = (text,delBtn = true) => {
    const listEl = document.createElement('list');
    listEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    listEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      listEl.append(delBtnEl);
    }

    return listEl;
    };

    if (notes.length === 0) {
      noteListItems.push(createList('No saved Notes', false));
    }

    notes.forEach((note) => noteList.append(note));
  };


// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = () => {
  activeNote = {};
  hide(newNoteBtn);
  renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
const handleRenderBtn = async() => {
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(saveNoteBtn);
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
    show(clearBtn);
  } else {
    show(saveNoteBtn);
    show(clearBtn);
  }
};

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtn);
}


getAndRenderNotes();