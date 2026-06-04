const jwt = require('jsonwebtoken');

const SECRET = 'epita_library_secret_2025';
const CREDENTIALS = { login: 'admin', password: 'password' };

function generateToken(login) {
  return jwt.sign({ login }, SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function checkCredentials(login, password) {
  return login === CREDENTIALS.login && password === CREDENTIALS.password;
}

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  const token = header.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
  req.user = payload;
  next();
}

module.exports = { generateToken, verifyToken, checkCredentials, authMiddleware };
