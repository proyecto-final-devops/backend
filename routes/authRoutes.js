// Importar dependencias
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// Controladores
const authController = require('../controllers/authController');
const perfilController = require('../controllers/perfilController');

// Rutas de autenticación
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Ruta protegida para obtener perfil del usuario
router.get('/perfil', authenticate, perfilController.obtenerPerfil);

module.exports = router;

