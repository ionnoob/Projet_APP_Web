const express = require('express');
const cors = require('cors');
const path = require('path');

const { authMiddleware } = require('./core/auth');
const authController = require('./controllers/authController');
const authorController = require('./controllers/authorController');
const bookController = require('./controllers/bookController');
const dashboardController = require('./controllers/dashboardController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'front')));

// --- Public routes ---
app.post('/api/auth/login', authController.login);

// --- Protected routes ---
app.use('/api', authMiddleware);

// Dashboard
app.get('/api/dashboard', dashboardController.getStats);

// Authors
app.get('/api/authors', authorController.getAll);
app.get('/api/authors/:id', authorController.getOne);
app.post('/api/authors', authorController.create);
app.put('/api/authors/:id', authorController.update);

// Books
app.get('/api/books', bookController.getAll);
app.get('/api/books/:id', bookController.getOne);
app.post('/api/books', bookController.create);
app.put('/api/books/:id', bookController.update);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
