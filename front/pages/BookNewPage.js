import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class BookNewPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
  }

  async mount() {
    if (!requireAuth()) return;
    this.sidebar.mount('/books/new');

    this.render(`<p style="color:var(--text-muted)">Chargement…</p>`);

    try {
      const authors = await api.get('/authors');

      this.render(`
        <h1 class="page-title">Ajouter un livre</h1>
        <div id="form-msg"></div>
        <div class="form-group">
          <label>Nom du livre</label>
          <input type="text" id="title" placeholder="Nom du livre" />
        </div>
        <div class="form-group">
          <label>Auteur</label>
          <select id="author">
            <option value="">-- Choisir un auteur --</option>
            ${authors.map(a => `<option value="${a.id}">${this._esc(a.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>État</label>
          <select id="status">
            <option value="en stock">En stock</option>
            <option value="emprunté">Emprunté</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn-primary" id="save-btn">Valider la création</button>
        </div>
      `);

      this.find('#save-btn').addEventListener('click', async () => {
        const title = this.find('#title').value.trim();
        const author_id = this.find('#author').value;
        const status = this.find('#status').value;
        const msg = this.find('#form-msg');

        if (!title) { msg.innerHTML = '<p class="error-msg">Le titre est requis</p>'; return; }
        if (!author_id) { msg.innerHTML = '<p class="error-msg">Veuillez choisir un auteur</p>'; return; }

        try {
          const book = await api.post('/books', { title, author_id, status });
          msg.innerHTML = `<p class="success-msg">✔ Livre créé avec succès ! <a href="#/books/${book.id}">Voir la fiche</a></p>`;
          this.find('#title').value = '';
          this.find('#author').value = '';
          this.find('#status').value = 'en stock';
        } catch (err) {
          msg.innerHTML = `<p class="error-msg">${err.message}</p>`;
        }
      });

    } catch (err) {
      this.render(`<p style="color:red">${err.message}</p>`);
    }
  }

  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}
