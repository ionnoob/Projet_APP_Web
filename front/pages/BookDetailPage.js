import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class BookDetailPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
  }

  async mount(params) {
    if (!requireAuth()) return;
    this.sidebar.mount('/books');

    this.render(`<p style="color:var(--text-muted)">Chargement…</p>`);

    try {
      const [book, authors] = await Promise.all([
        api.get(`/books/${params.id}`),
        api.get('/authors'),
      ]);

      this.render(`
        <h1 class="page-title">Modifier un livre</h1>
        <div id="form-msg"></div>
        <div class="form-group">
          <label>Nom du livre</label>
          <input type="text" id="title" value="${this._esc(book.title)}" />
        </div>
        <div class="form-group">
          <label>Auteur</label>
          <select id="author">
            ${authors.map(a => `<option value="${a.id}" ${a.id === book.author_id ? 'selected' : ''}>${this._esc(a.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>État</label>
          <select id="status">
            <option value="en stock" ${book.status === 'en stock' ? 'selected' : ''}>En stock</option>
            <option value="emprunté" ${book.status === 'emprunté' ? 'selected' : ''}>Emprunté</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn-primary" id="save-btn">Valider les modifications</button>
        </div>
      `);

      this.find('#save-btn').addEventListener('click', async () => {
        const title = this.find('#title').value.trim();
        const author_id = this.find('#author').value;
        const status = this.find('#status').value;
        const msg = this.find('#form-msg');

        if (!title) { msg.innerHTML = '<p class="error-msg">Le titre est requis</p>'; return; }

        try {
          await api.put(`/books/${params.id}`, { title, author_id, status });
          msg.innerHTML = '<p class="success-msg">✔ Modifications enregistrées</p>';
        } catch (err) {
          msg.innerHTML = `<p class="error-msg">${err.message}</p>`;
        }
      });

    } catch (err) {
      this.render(`<p style="color:red">${err.message}</p>`);
    }
  }

  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}
