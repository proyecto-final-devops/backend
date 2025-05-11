// controllers/perfilController.js

exports.obtenerPerfil = async (req, res) => {
    try {
      res.json({
        mensaje: 'Token verificado correctamente',
        id: req.user._id,
        tipo_usuario: req.user.tipo_usuario
      });
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  };
  