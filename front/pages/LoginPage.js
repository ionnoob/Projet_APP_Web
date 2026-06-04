import { Component, api } from '../lib.js';

export class LoginPage extends Component {
  constructor() {
    super('#main');
  }

  mount() {
    document.getElementById('app').classList.add('login-mode');
    document.getElementById('sidebar').style.display = 'none';

    this.render(`
      <div class="login-card">
        <h1>Connexion</h1>
        <div id="login-error" class="error-msg" style="display:none"></div>
        <input type="text" id="login-input" placeholder="Login *" autocomplete="username" />
        <input type="password" id="password-input" placeholder="Mot de passe *" autocomplete="current-password" />
        <button class="btn-primary" id="login-btn">Connexion</button>
      </div>
    `);

    const doLogin = async () => {
      const login = this.find('#login-input').value.trim();
      const password = this.find('#password-input').value;
      const errEl = this.find('#login-error');
      errEl.style.display = 'none';

      if (!login || !password) {
        errEl.textContent = 'Veuillez remplir tous les champs';
        errEl.style.display = 'block';
        return;
      }

      try {
        const { token } = await api.post('/auth/login', { login, password });
        api.setToken(token);
        document.getElementById('app').classList.remove('login-mode');
        document.getElementById('sidebar').style.display = '';
        window.location.hash = '#/';
      } catch (err) {
        errEl.textContent = err.message || 'Identifiants incorrects';
        errEl.style.display = 'block';
      }
    };

    this.find('#login-btn').addEventListener('click', doLogin);
    this.find('#password-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }

  destroy() {
    document.getElementById('app').classList.remove('login-mode');
    document.getElementById('sidebar').style.display = '';
  }
}
