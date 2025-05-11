const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');  // Asegúrate de tener esta conexión configurada

// Registrar un usuario
exports.registerUser = async (req, res) => {
  const { username, password, correo, tipo_usuario } = req.body;

  if (!username || !password || !correo || !tipo_usuario) {
    return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos' });
  }

  try {
    // Verificar si el usuario ya existe
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    const insertResult = await pool.query(
      'INSERT INTO usuarios (nombre ,correo, password, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, correo, hashedPassword, tipo_usuario]
    );

    // Responder con el usuario creado (sin la contraseña)
    const user = insertResult.rows[0];
    res.status(201).json({
      id: user.id,
      correo: user.correo,
      username: user.nombre, 
      tipo_usuario: user.tipo_usuario,
      message: 'Usuario registrado exitosamente'
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    // Buscar el usuario en la base de datos
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }


    // Responder con el token y tipo_usuario
    res.status(200).json({
      correo: user.correo,
      tipo_usuario: user.tipo_usuario
    });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
