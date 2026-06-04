import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class BooksPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
    this._books = [];
  }

  async mount(params, query) {
    if (!requireAuth()) return;
    this.sidebar.mount('/books');

    this.render(`
      <h1 class="page-title">Rechercher un livre</h1>
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Recherche par nom" value="${query.q || ''}" />
        <button class="btn-primary" id="search-btn">Filtrer</button>
      </div>
      <div id="books-table-wrapper">
        <p style="color:var(--text-muted)">Chargement…</p>
      </div>
    `);

    this.find('#search-btn').addEventListener('click', () => this._search());
    this.find('#search-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') this._search();
    });

    await this._loadBooks(query.q || '');
  }

  _search() {
    const q = this.find('#search-input').value.trim();
    window.location.hash = `#/books${q ? '?q=' + encodeURIComponent(q) : ''}`;
  }

  async _loadBooks(search) {
    const wrapper = this.find('#books-table-wrapper');
    try {
      const books = await api.get(`/books${search ? '?search=' + encodeURIComponent(search) : ''}`);
      if (!books.length) {
        wrapper.innerHTML = '<p style="color:var(--text-muted);padding:20px 0">Aucun livre trouvé.</p>';
        return;
      }
      wrapper.innerHTML = `
        <table class="data-table">
          <thead>
            <tr><th>Nom du livre</th><th>Auteur</th><th>État</th></tr>
          </thead>
          <tbody>
            ${books.map(b => `
              <tr>
                <td><a href="#/books/${b.id}">${this._esc(b.title)}</a></td>
                <td>${this._esc(b.author_name)}</td>
                <td class="${b.status === 'emprunté' ? 'badge-emprunte' : 'badge-stock'}">${b.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      wrapper.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  }

  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}
