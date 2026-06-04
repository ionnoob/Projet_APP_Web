const { getDb, nextId } = require('../core/database');

function findAll(search = '') {
  const db = getDb();
  let authors = db.get('authors').value();
  if (search) {
    const q = search.toLowerCase();
    authors = authors.filter(a => a.name.toLowerCase().includes(q));
  }
  return authors.map(a => ({
    ...a,
    book_count: db.get('books').filter({ author_id: a.id }).size().value()
  })).sort((a, b) => a.name.localeCompare(b.name));
}

function findById(id) {
  const db = getDb();
  const author = db.get('authors').find({ id: Number(id) }).value();
  if (!author) return null;
  const books = db.get('books').filter({ author_id: Number(id) }).sortBy('title').value();
  return { ...author, books };
}

function create(name) {
  const db = getDb();
  const id = nextId('authors');
  const author = { id, name };
  db.get('authors').push(author).write();
  return author;
}

function update(id, name) {
  const db = getDb();
  const author = db.get('authors').find({ id: Number(id) });
  if (!author.value()) return false;
  author.assign({ name }).write();
  return true;
}

function count() {
  return getDb().get('authors').size().value();
}

module.exports = { findAll, findById, create, update, count };
