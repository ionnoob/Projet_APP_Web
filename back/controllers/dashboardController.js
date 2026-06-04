const bookModel = require('../models/bookModel');
const authorModel = require('../models/authorModel');

function getStats(req, res) {
  res.json({
    books: bookModel.count(),
    authors: authorModel.count(),
    borrowed: bookModel.countBorrowed(),
  });
}

module.exports = { getStats };
