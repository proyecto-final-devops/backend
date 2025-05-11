const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productosRoutes = require('./routes/productRoutes');
const usuariosRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', usuariosRoutes);
app.use('/api/usuarios', usuariosRoutes);                                                                                          

  app.use('/api/usuarios', usuariosRoutes);                                                                                          

                                                
app.use('/api/usuarios', usuariosRoutes);                                                                                          

app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.send('API de productos funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;