// Notes Variables
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = notes.length > 0 ? notes[0].id : null;

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = note.id === currentNoteId ? 'active' : '';
        
        const noteContainer = document.createElement('div');
        noteContainer.className = 'notes-list-item';
       // Modify the note list item creation in renderNotesList():
noteContainer.innerHTML = `
<span class="note-title-text">${note.title || 'Untitled Note'}</span>
<button class="delete-note-btn" data-id="${note.id}" aria-label="Delete note">
    <i class="fas fa-trash-alt"></i>
</button>
`;
        
        noteContainer.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-note-btn')) {
                currentNoteId = note.id;
                renderNoteEditor();
                renderNotesList();
            }
        });
        
        li.appendChild(noteContainer);
        notesList.appendChild(li);
    });

    // Add delete note handlers
    document.querySelectorAll('.delete-note-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const noteId = parseInt(this.getAttribute('data-id'));
          
                notes = notes.filter(n => n.id !== noteId);
                saveNotes();
                if (currentNoteId === noteId) {
                    currentNoteId = notes.length > 0 ? notes[0].id : null;
                }
                renderNotesList();
                renderNoteEditor();
            
        });
    });
}

function renderNoteEditor() {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        document.getElementById('note-title').value = note.title || '';
        document.getElementById('notes-textarea').value = note.content || '';
        updateNotesStats();
    }
}

function renderMarkdownPreview() {
    const text = document.getElementById('notes-textarea').value;
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>');
    document.getElementById('notes-preview-view').innerHTML = html;
}

function updateNotesStats() {
    const text = document.getElementById('notes-textarea').value;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const charCount = text.length;
    
    document.getElementById('notes-stats').textContent = 
        `${wordCount} ${wordCount === 1 ? 'word' : 'words'}, ${charCount} characters`;
}

function wrapSelectionWith(prefix, suffix) {
    const textarea = document.getElementById('notes-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    textarea.value = beforeText + prefix + selectedText + suffix + afterText;
    textarea.focus();
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = end + prefix.length;
    
    const event = new Event('input');
    textarea.dispatchEvent(event);
}

function insertAtCursor(text) {
    const textarea = document.getElementById('notes-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    textarea.value = beforeText + text + afterText;
    textarea.focus();
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
    
    const event = new Event('input');
    textarea.dispatchEvent(event);
}

// Notes Event Listeners
document.getElementById('new-note').addEventListener('click', function() {
    const newNote = {
        id: Date.now(),
        title: 'Untitled Note',
        content: '',
        createdAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    currentNoteId = newNote.id;
    saveNotes();
    renderNotesList();
    renderNoteEditor();
});

document.getElementById('note-title').addEventListener('input', function() {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        note.title = this.value;
        saveNotes();
        renderNotesList();
    }
});

document.getElementById('notes-textarea').addEventListener('input', function() {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        note.content = this.value;
        saveNotes();
        updateNotesStats();
    }
});

// Notes View Tabs
document.querySelectorAll('.notes-view-tabs button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.notes-view-tabs button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        if (this.dataset.view === 'edit') {
            document.getElementById('notes-edit-view').style.display = 'block';
            document.getElementById('notes-preview-view').style.display = 'none';
        } else {
            document.getElementById('notes-edit-view').style.display = 'none';
            document.getElementById('notes-preview-view').style.display = 'block';
            renderMarkdownPreview();
        }
    });
});

// Formatting buttons
document.getElementById('bold-btn').addEventListener('click', function() {
    wrapSelectionWith('**', '**');
});

document.getElementById('italic-btn').addEventListener('click', function() {
    wrapSelectionWith('*', '*');
});

document.getElementById('ul-btn').addEventListener('click', function() {
    insertAtCursor('- ');
});

document.getElementById('ol-btn').addEventListener('click', function() {
    insertAtCursor('1. ');
});

// Clear notes
document.getElementById('clear-notes').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear this note?')) {
        const note = notes.find(n => n.id === currentNoteId);
        if (note) {
            note.content = '';
            document.getElementById('notes-textarea').value = '';
            saveNotes();
            updateNotesStats();
        }
    }
});

// Save notes
document.getElementById('save-notes').addEventListener('click', function() {
    alert('Note saved!');
});

// Export note
document.getElementById('export-note').addEventListener('click', function() {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        const data = JSON.stringify(note, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focusflow-note-${note.title || 'untitled'}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
});

// Initialize
renderNotesList();
if (currentNoteId) {
    renderNoteEditor();
}

// Add debouncing to save notes
let saveTimeout;
document.getElementById('notes-textarea').addEventListener('input', function() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
      note.content = this.value;
      saveNotes();
    }
  }, 1000);
});