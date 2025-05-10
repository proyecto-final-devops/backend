// Importar el modelo de productos
const Producto = require('../models/productos');

// Método para crear un producto
exports.createProduct = async (req, res) => {
  const { descripcion, imagen, precio, stock, titulo } = req.body;
  try {
    const product = await Producto.crearProducto({ descripcion, imagen, precio, stock, titulo });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Método para obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Producto.getProductos();
    res.status(200).json(products);
  } catch (err) {
    res.status(400).send('Error al obtener productos');
  }
};

// Método para actualizar un producto
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { descripcion, imagen, precio, stock, titulo } = req.body;
  try {
    const product = await Producto.actualizarProducto(id, { descripcion, imagen, precio, stock, titulo });
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).send('Error al actualizar producto');
  }
};

// Método para eliminar un producto
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Producto.eliminarProducto(id);
    res.status(200).send('Producto eliminado');
  } catch (err) {
    res.status(400).send('Error al eliminar producto');
  }
};
