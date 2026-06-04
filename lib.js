/**
 * MiniLib - Lightweight frontend library
 * Router + Component system for the library app
 */

// Router
class Router {
  constructor(routes) {
    this.routes = routes;
    this._currentCleanup = null;
    window.addEventListener('hashchange', () => this._resolve());
    window.addEventListener('load', () => this._resolve());
  }

  _resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryStr] = hash.split('?');
    const params = {};
    const query = {};

    if (queryStr) {
      queryStr.split('&').forEach(p => {
        const [k, v] = p.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    let matched = null;
    for (const route of this.routes) {
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      if (routeParts.length !== pathParts.length) continue;
      let match = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      if (match) { matched = route; break; }
    }

    if (!matched) {
      window.location.hash = '#/';
      return;
    }

    if (this._currentCleanup) this._currentCleanup();
    const result = matched.handler(params, query);
    this._currentCleanup = (result && result.destroy) ? result.destroy.bind(result) : null;
  }

  navigate(path) {
    window.location.hash = '#' + path;
  }
}

//Component 
class Component {
  constructor(selector) {
    this.el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
  }

  render(html) {
    if (this.el) this.el.innerHTML = html;
  }

  on(event, selector, handler) {
    if (!this.el) return;
    this.el.addEventListener(event, e => {
      const target = e.target.closest(selector);
      if (target && this.el.contains(target)) handler(e, target);
    });
  }

  find(selector) {
    return this.el ? this.el.querySelector(selector) : null;
  }

  findAll(selector) {
    return this.el ? [...this.el.querySelectorAll(selector)] : [];
  }

  destroy() {}
}

// API Client
const API_BASE = '/api';

class ApiClient {
  constructor() {
    this._token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this._token = token;
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }

  getToken() { return this._token; }

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (this._token) headers['Authorization'] = `Bearer ${this._token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(API_BASE + path, opts);

    if (res.status === 401) {
      this.setToken(null);
      window.location.hash = '#/login';
      throw new Error('Non autorisé');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur serveur');
    return data;
  }

  get(path) { return this.request('GET', path); }
  post(path, body) { return this.request('POST', path, body); }
  put(path, body) { return this.request('PUT', path, body); }
}

const api = new ApiClient();

// Auth guard 
function requireAuth() {
  if (!api.getToken()) {
    window.location.hash = '#/login';
    return false;
  }
  return true;
}

export { Router, Component, api, requireAuth };
