import api from './api.js';
import Swal from 'sweetalert2';

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const notesContainer = document.getElementById('notesContainer');
  const archivedNotesContainer = document.getElementById('archivedNotesContainer');
  const noteForm = document.querySelector('note-form');

  noteForm.addEventListener('note-added', async (e) => {
    const { title, body } = e.detail;
    try {
      await api.addNote(title, body);
      await renderNotes();
    } catch (error) {
      showError('Gagal menambahkan catatan');
    }
  });

  document.addEventListener('archive-note', async (e) => {
    const noteId = e.composedPath().find(el => el.tagName === 'NOTE-ITEM').getAttribute('data-id');
    try {
      await api.archiveNote(noteId);
      await renderNotes();
    } catch (error) {
      showError('Gagal mengarsipkan catatan');
    }
  });

  document.addEventListener('restore-note', async (e) => {
    const noteId = e.composedPath().find(el => el.tagName === 'NOTE-ITEM').getAttribute('data-id');
    try {
      await api.unarchiveNote(noteId);
      await renderNotes();
    } catch (error) {
      showError('Gagal mengembalikan catatan');
    }
  });

  document.addEventListener('delete-note', async (e) => {
    const noteId = e.composedPath().find(el => el.tagName === 'NOTE-ITEM').getAttribute('data-id');
    try {
      await api.deleteNote(noteId);
      await renderNotes();
    } catch (error) {
      showError('Gagal menghapus catatan');
    }
  });

  async function renderNotes() {
    notesContainer.innerHTML = '<loading-spinner></loading-spinner>';
    archivedNotesContainer.innerHTML = '<loading-spinner></loading-spinner>';

    try {
      const [activeNotes, archivedNotes] = await Promise.all([
        api.getNotes(),
        api.getArchivedNotes(),
      ]);

      notesContainer.innerHTML = '';
      archivedNotesContainer.innerHTML = '';

      if (activeNotes.length === 0) {
        notesContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-sticky-note"></i>
            <p>No notes available. Create your first note!</p>
          </div>`;
      } else {
        activeNotes.forEach(note => {
          const noteElement = document.createElement('note-item');
          noteElement.setAttribute('title', note.title);
          noteElement.setAttribute('body', note.body);
          noteElement.setAttribute('created', note.createdAt);
          noteElement.setAttribute('data-id', note.id);
          noteElement.setAttribute('archived', note.archived);
          notesContainer.appendChild(noteElement);
        });
      }

      if (archivedNotes.length === 0) {
        archivedNotesContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-archive"></i>
            <p>No archived notes yet</p>
          </div>`;
      } else {
        archivedNotes.forEach(note => {
          const noteElement = document.createElement('note-item');
          noteElement.setAttribute('title', note.title);
          noteElement.setAttribute('body', note.body);
          noteElement.setAttribute('created', note.createdAt);
          noteElement.setAttribute('data-id', note.id);
          noteElement.setAttribute('archived', note.archived);
          archivedNotesContainer.appendChild(noteElement);
        });
      }
    } catch (error) {
      showError('Gagal mengambil data catatan');
    }
  }

  function showError(message) {
    alert(message); // Atau ganti dengan sweetalert2 kalau mau
  }

  renderNotes(); // Panggil saat pertama masuk
});
