const pool = require('../db'); // conexión a PostgreSQL

// Obtener todos los productos
const getProductos = async () => {
  const result = await pool.query('SELECT * FROM productos ORDER BY id');
  return result.rows;
};

// Obtener un producto por ID
const getProductoById = async (id) => {
  const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear un nuevo producto
const crearProducto = async ({ descripcion, imagen, precio, stock, titulo }) => {
  const result = await pool.query(
    'INSERT INTO productos (descripcion, imagen, precio, stock, titulo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [descripcion, imagen, precio, stock, titulo]
  );
  return result.rows[0];
};

// Actualizar un producto
const actualizarProducto = async (id, { descripcion, imagen, precio, stock, titulo }) => {
  const result = await pool.query(
    'UPDATE productos SET descripcion = $1, imagen = $2, precio = $3, stock = $4, titulo = $5 WHERE id = $6 RETURNING *',
    [descripcion, imagen, precio, stock, titulo, id]
  );
  return result.rows[0];
};

// Eliminar un producto
const eliminarProducto = async (id) => {
  await pool.query('DELETE FROM productos WHERE id = $1', [id]);
};



module.exports = {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
