import { Component, api } from '../lib.js';

export class Sidebar extends Component {
  constructor() {
    super('#sidebar');
  }

  mount(activeRoute) {
    const links = [
      { href: '/', label: 'Tableau de bord' },
      { href: '/books', label: 'Chercher un livre' },
      { href: '/authors', label: 'Chercher un auteur' },
      { href: '/books/new', label: 'Ajouter un livre' },
      { href: '/authors/new', label: 'Ajouter un auteur' },
    ];

    this.render(`
      <div class="sidebar-logo">📚 Bibliothèque</div>
      <nav>
        ${links.map(l => `
          <a href="#${l.href}" class="${activeRoute === l.href ? 'active' : ''}">
            ${l.label}
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-bottom">
        <a id="logout-btn">Déconnexion</a>
      </div>
    `);

    this.find('#logout-btn').addEventListener('click', () => {
      api.setToken(null);
      window.location.hash = '#/login';
    });
  }
}
