const bookModel = require('../models/bookModel');

function getAll(req, res) {
  const { search } = req.query;
  const books = bookModel.findAll(search || '');
  res.json(books);
}

function getOne(req, res) {
  const book = bookModel.findById(parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Livre non trouvé' });
  res.json(book);
}

function create(req, res) {
  const { title, author_id, status } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Le titre est requis' });
  if (!author_id) return res.status(400).json({ error: "L'auteur est requis" });
  const validStatus = ['en stock', 'emprunté'].includes(status) ? status : 'en stock';
  const book = bookModel.create(title.trim(), parseInt(author_id), validStatus);
  res.status(201).json(book);
}

function update(req, res) {
  const { title, author_id, status } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Le titre est requis' });
  if (!author_id) return res.status(400).json({ error: "L'auteur est requis" });
  if (!['en stock', 'emprunté'].includes(status)) return res.status(400).json({ error: 'Statut invalide' });
  const success = bookModel.update(parseInt(req.params.id), title.trim(), parseInt(author_id), status);
  if (!success) return res.status(404).json({ error: 'Livre non trouvé' });
  res.json({ success: true });
}

module.exports = { getAll, getOne, create, update };
