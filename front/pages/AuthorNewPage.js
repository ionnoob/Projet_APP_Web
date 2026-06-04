import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class AuthorNewPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
  }

  mount() {
    if (!requireAuth()) return;
    this.sidebar.mount('/authors/new');

    this.render(`
      <h1 class="page-title">Ajouter un auteur</h1>
      <div id="form-msg"></div>
      <div class="form-group">
        <label>Nom de l'auteur</label>
        <input type="text" id="name" placeholder="Nom de l'auteur" />
      </div>
      <div class="form-actions">
        <button class="btn-primary" id="save-btn">Valider la création</button>
      </div>
    `);

    this.find('#save-btn').addEventListener('click', async () => {
      const name = this.find('#name').value.trim();
      const msg = this.find('#form-msg');

      if (!name) { msg.innerHTML = '<p class="error-msg">Le nom est requis</p>'; return; }

      try {
        const author = await api.post('/authors', { name });
        msg.innerHTML = `<p class="success-msg">✔ Auteur créé avec succès ! <a href="#/authors/${author.id}">Voir la fiche</a></p>`;
        this.find('#name').value = '';
      } catch (err) {
        msg.innerHTML = `<p class="error-msg">${err.message}</p>`;
      }
    });

    this.find('#name').addEventListener('keydown', e => {
      if (e.key === 'Enter') this.find('#save-btn').click();
    });
  }
}
