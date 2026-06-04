import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class AuthorsPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
  }

  async mount(params, query) {
    if (!requireAuth()) return;
    this.sidebar.mount('/authors');

    this.render(`
      <h1 class="page-title">Rechercher un auteur</h1>
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Recherche par nom" value="${query.q || ''}" />
        <button class="btn-primary" id="search-btn">Filtrer</button>
      </div>
      <div id="authors-table-wrapper">
        <p style="color:var(--text-muted)">Chargement…</p>
      </div>
    `);

    this.find('#search-btn').addEventListener('click', () => this._search());
    this.find('#search-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') this._search();
    });

    await this._loadAuthors(query.q || '');
  }

  _search() {
    const q = this.find('#search-input').value.trim();
    window.location.hash = `#/authors${q ? '?q=' + encodeURIComponent(q) : ''}`;
  }

  async _loadAuthors(search) {
    const wrapper = this.find('#authors-table-wrapper');
    try {
      const authors = await api.get(`/authors${search ? '?search=' + encodeURIComponent(search) : ''}`);
      if (!authors.length) {
        wrapper.innerHTML = '<p style="color:var(--text-muted);padding:20px 0">Aucun auteur trouvé.</p>';
        return;
      }
      wrapper.innerHTML = `
        <table class="data-table">
          <thead>
            <tr><th>Nom de l'auteur</th><th>Nombre de livres</th></tr>
          </thead>
          <tbody>
            ${authors.map(a => `
              <tr>
                <td><a href="#/authors/${a.id}">${this._esc(a.name)}</a></td>
                <td>${a.book_count}</td>
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
