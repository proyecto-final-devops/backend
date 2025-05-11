// controllers/perfilController.js

const pool = require('../db'); 

exports.obtenerPerfil = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json({
      mensaje: 'Perfiles obtenidos correctamente',
      usuarios: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};