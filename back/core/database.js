const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');
const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// Schema defaults + seed
db.defaults({ authors: [], books: [], _nextAuthorId: 1, _nextBookId: 1 }).write();

// Seed if empty
if (db.get('authors').size().value() === 0) {
  const authorNames = [
    'Victor Hugo', 'Albert Camus', 'Simone de Beauvoir', 'Marcel Proust',
    'Gustave Flaubert', 'Émile Zola', 'Stendhal', 'Honoré de Balzac',
    'Molière', 'Jean Racine'
  ];

  let aid = 1;
  const authors = authorNames.map(name => ({ id: aid++, name }));
  db.set('authors', authors).write();
  db.set('_nextAuthorId', aid).write();

  const booksData = [
    { title: 'Les Misérables',                    author_id: 1, status: 'en stock'  },
    { title: 'Notre-Dame de Paris',                author_id: 1, status: 'emprunté'  },
    { title: "L'Étranger",                         author_id: 2, status: 'en stock'  },
    { title: 'La Peste',                           author_id: 2, status: 'en stock'  },
    { title: 'Le Deuxième Sexe',                   author_id: 3, status: 'emprunté'  },
    { title: 'Du côté de chez Swann',              author_id: 4, status: 'en stock'  },
    { title: "À l'ombre des jeunes filles en fleurs", author_id: 4, status: 'emprunté' },
    { title: 'Madame Bovary',                      author_id: 5, status: 'en stock'  },
    { title: "L'Éducation sentimentale",           author_id: 5, status: 'en stock'  },
    { title: 'Germinal',                           author_id: 6, status: 'emprunté'  },
    { title: 'Nana',                               author_id: 6, status: 'en stock'  },
    { title: "L'Assommoir",                        author_id: 6, status: 'en stock'  },
    { title: 'Le Rouge et le Noir',                author_id: 7, status: 'emprunté'  },
    { title: 'La Chartreuse de Parme',             author_id: 7, status: 'en stock'  },
    { title: 'Eugénie Grandet',                    author_id: 8, status: 'en stock'  },
    { title: 'Le Père Goriot',                     author_id: 8, status: 'emprunté'  },
    { title: 'La Comédie humaine',                 author_id: 8, status: 'en stock'  },
    { title: 'Le Bourgeois Gentilhomme',           author_id: 9, status: 'en stock'  },
    { title: 'Tartuffe',                           author_id: 9, status: 'emprunté'  },
    { title: 'Phèdre',                             author_id: 10, status: 'en stock' },
  ];

  let bid = 1;
  const books = booksData.map(b => ({ id: bid++, ...b }));
  db.set('books', books).write();
  db.set('_nextBookId', bid).write();
}

function getDb() { return db; }

function nextId(col) {
  const key = `_next${col.charAt(0).toUpperCase() + col.slice(1, -1)}Id`;
  const id = db.get(key).value();
  db.set(key, id + 1).write();
  return id;
}

module.exports = { getDb, nextId };
