import { Component, api, requireAuth } from '../lib.js';
import { Sidebar } from '../components/Sidebar.js';

export class DashboardPage extends Component {
  constructor() {
    super('#main');
    this.sidebar = new Sidebar();
  }

  async mount() {
    if (!requireAuth()) return;
    this.sidebar.mount('/');

    this.render(`
      <h1 class="page-title">Tableau de bord</h1>
      <div class="section-title">Chiffres clés :</div>
      <div class="stat-grid" id="stats-grid">
        <div class="stat-card"><div class="label">Nombre de livres</div><div class="value" id="stat-books">…</div></div>
        <div class="stat-card"><div class="label">Nombre d'auteurs</div><div class="value" id="stat-authors">…</div></div>
        <div class="stat-card"><div class="label">Nombre de livres empruntés</div><div class="value" id="stat-borrowed">…</div></div>
      </div>
    `);

    try {
      const stats = await api.get('/dashboard');
      this.find('#stat-books').textContent = stats.books;
      this.find('#stat-authors').textContent = stats.authors;
      this.find('#stat-borrowed').textContent = stats.borrowed;
    } catch (err) {
      this.find('#stats-grid').innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  }
}
