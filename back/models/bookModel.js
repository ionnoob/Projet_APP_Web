const { getDb, nextId } = require('../core/database');

function _withAuthor(book) {
  const db = getDb();
  const author = db.get('authors').find({ id: book.author_id }).value();
  return { ...book, author_name: author ? author.name : 'Inconnu' };
}

function findAll(search = '') {
  const db = getDb();
  let books = db.get('books').value();
  if (search) {
    const q = search.toLowerCase();
    books = books.filter(b => b.title.toLowerCase().includes(q));
  }
  return books.map(_withAuthor).sort((a, b) => a.title.localeCompare(b.title));
}

function findById(id) {
  const db = getDb();
  const book = db.get('books').find({ id: Number(id) }).value();
  if (!book) return null;
  return _withAuthor(book);
}

function create(title, author_id, status) {
  const db = getDb();
  const id = nextId('books');
  const book = { id, title, author_id: Number(author_id), status };
  db.get('books').push(book).write();
  return book;
}

function update(id, title, author_id, status) {
  const db = getDb();
  const book = db.get('books').find({ id: Number(id) });
  if (!book.value()) return false;
  book.assign({ title, author_id: Number(author_id), status }).write();
  return true;
}

function count() {
  return getDb().get('books').size().value();
}

function countBorrowed() {
  return getDb().get('books').filter({ status: 'emprunté' }).size().value();
}

module.exports = { findAll, findById, create, update, count, countBorrowed };
