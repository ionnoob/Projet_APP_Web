const { generateToken, checkCredentials } = require('../core/auth');

function login(req, res) {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: 'Login et mot de passe requis' });
  }
  if (!checkCredentials(login, password)) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }
  const token = generateToken(login);
  res.json({ token });
}

module.exports = { login };
