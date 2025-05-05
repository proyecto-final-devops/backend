const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error al obtener el usuario');
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, correo } = req.body;
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo) VALUES ($1, $2) RETURNING *`,
      [nombre, correo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // código de error de PostgreSQL para clave duplicada
      res.status(400).send('Correo ya registrado');
    } else {
      res.status(500).send('Error al crear el usuario');
    }
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    const result = await pool.query(
      `UPDATE usuarios SET nombre = $1, correo = $2 WHERE id = $3 RETURNING *`,
      [nombre, correo, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error al actualizar el usuario');
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.send('Usuario eliminado');
  } catch (err) {
    res.status(500).send('Error al eliminar el usuario');
  }
});

module.exports = router;
