const BASE_URL = 'https://notes-api.dicoding.dev/v2';
import Swal from 'sweetalert2';

const api = {
  async getNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      if (!response.ok) throw new Error('Gagal mengambil data catatan');
      const result = await response.json();
      return result.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.message,
      });
    }
  },

  async addNote(title, body) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (!response.ok) throw new Error('Gagal menambahkan catatan baru');
      const result = await response.json();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil ditambahkan.',
        timer: 1500,
        showConfirmButton: false,
      });

      return result.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan!',
        text: error.message,
      });
    }
  },

  async deleteNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Gagal menghapus catatan');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil dihapus.',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus!',
        text: error.message,
      });
    }
  },

  async archiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Gagal mengarsipkan catatan');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil diarsipkan.',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Arsip!',
        text: error.message,
      });
    }
  },

  async unarchiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Gagal mengembalikan catatan dari arsip');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil dikembalikan.',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Unarsip!',
        text: error.message,
      });
    }
  },

  async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      if (!response.ok) throw new Error('Gagal mengambil data catatan terarsip');
      const result = await response.json();
      return result.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.message,
      });
    }
  }
};

export default api;
