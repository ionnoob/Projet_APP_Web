const authorModel = require('../models/authorModel');

function getAll(req, res) {
  const { search } = req.query;
  const authors = authorModel.findAll(search || '');
  res.json(authors);
}

function getOne(req, res) {
  const author = authorModel.findById(parseInt(req.params.id));
  if (!author) return res.status(404).json({ error: 'Auteur non trouvé' });
  res.json(author);
}

function create(req, res) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom est requis' });
  }
  const author = authorModel.create(name.trim());
  res.status(201).json(author);
}

function update(req, res) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom est requis' });
  }
  const success = authorModel.update(parseInt(req.params.id), name.trim());
  if (!success) return res.status(404).json({ error: 'Auteur non trouvé' });
  res.json({ success: true });
}

module.exports = { getAll, getOne, create, update };
