import { Router, api } from './lib.js';
import { LoginPage }        from './pages/LoginPage.js';
import { DashboardPage }    from './pages/DashboardPage.js';
import { BooksPage }        from './pages/BooksPage.js';
import { BookDetailPage }   from './pages/BookDetailPage.js';
import { BookNewPage }      from './pages/BookNewPage.js';
import { AuthorsPage }      from './pages/AuthorsPage.js';
import { AuthorDetailPage } from './pages/AuthorDetailPage.js';
import { AuthorNewPage }    from './pages/AuthorNewPage.js';

const router = new Router([
  {
    path: '/login',
    handler: () => {
      // If already logged in, redirect to dashboard
      if (api.getToken()) { window.location.hash = '#/'; return; }
      const page = new LoginPage();
      page.mount();
      return page;
    }
  },
  {
    path: '/',
    handler: () => {
      const page = new DashboardPage();
      page.mount();
      return page;
    }
  },
  {
    path: '/books',
    handler: (params, query) => {
      const page = new BooksPage();
      page.mount(params, query);
      return page;
    }
  },
  {
    path: '/books/new',
    handler: () => {
      const page = new BookNewPage();
      page.mount();
      return page;
    }
  },
  {
    path: '/books/:id',
    handler: (params) => {
      const page = new BookDetailPage();
      page.mount(params);
      return page;
    }
  },
  {
    path: '/authors',
    handler: (params, query) => {
      const page = new AuthorsPage();
      page.mount(params, query);
      return page;
    }
  },
  {
    path: '/authors/new',
    handler: () => {
      const page = new AuthorNewPage();
      page.mount();
      return page;
    }
  },
  {
    path: '/authors/:id',
    handler: (params) => {
      const page = new AuthorDetailPage();
      page.mount(params);
      return page;
    }
  },
]);
