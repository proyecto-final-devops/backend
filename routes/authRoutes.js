const express = require('express');
const router = express.Router();

// Importa el controlador de autenticación
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;