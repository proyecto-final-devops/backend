const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/usuarios', usuariosRoutes);

app.use(cors({
  origin: 'http://localhost:4200', // Cambia esto al dominio de tu frontend en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.send('API de productos funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
