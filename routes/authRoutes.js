const express = require('express');
const router = express.Router();

// Importa el controlador de autenticación
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth'); // ✅ Línea agregada

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', verifyToken, (req, res) => {           // ✅ Línea agregada
  res.status(200).json({ message: 'Perfil de usuario', user: req.user });
});

module.exports = router;
