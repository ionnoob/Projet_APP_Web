import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class AuthorDetailPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
  }

  async mount(params) {
    if (!requireAuth()) return;
    this.sidebar.mount('/authors');

    this.render(`<p style="color:var(--text-muted)">Chargement…</p>`);

    try {
      const author = await api.get(`/authors/${params.id}`);

      this.render(`
        <h1 class="page-title">Modifier un auteur</h1>
        <div id="form-msg"></div>
        <div class="form-group">
          <label>Nom de l'auteur</label>
          <input type="text" id="name" value="${this._esc(author.name)}" />
        </div>
        <div class="form-actions">
          <button class="btn-primary" id="save-btn">Valider les modifications</button>
        </div>

        <h2 style="font-size:1.1rem;font-weight:700;margin:36px 0 14px;color:var(--text)">
          Liste des livres de cet auteur
        </h2>
        ${author.books.length === 0
          ? '<p style="color:var(--text-muted)">Aucun livre pour cet auteur.</p>'
          : `<table class="data-table">
              <thead>
                <tr><th>Nom du livre</th><th>État</th></tr>
              </thead>
              <tbody>
                ${author.books.map(b => `
                  <tr>
                    <td><a href="#/books/${b.id}">${this._esc(b.title)}</a></td>
                    <td class="${b.status === 'emprunté' ? 'badge-emprunte' : 'badge-stock'}">${b.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`
        }
      `);

      this.find('#save-btn').addEventListener('click', async () => {
        const name = this.find('#name').value.trim();
        const msg = this.find('#form-msg');

        if (!name) { msg.innerHTML = '<p class="error-msg">Le nom est requis</p>'; return; }

        try {
          await api.put(`/authors/${params.id}`, { name });
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
