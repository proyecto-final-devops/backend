const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.get('Authorization') || req.header('authorization');
    if (!header) {
      return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }

    let token = header.trim();
    if (/^Bearer\s+/i.test(header)) {
      token = header.replace(/^Bearer\s+/i, '').trim();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Agregar datos del usuario al request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(400).json({ error: 'Token no válido' });
  }
};