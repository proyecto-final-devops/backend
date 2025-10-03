
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Configurar secreto para JWT usado por middleware/auth.js
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Mock del modelo de productos para aislar la lógica del controlador/ruta
jest.mock('../models/productos', () => {
  const productos = [
    { id: 1, titulo: 'Prod A', descripcion: 'Desc A', precio: 10, stock: 5, imagen: 'a.png' },
    { id: 2, titulo: 'Prod B', descripcion: 'Desc B', precio: 20, stock: 3, imagen: 'b.png' },
  ];
  return {
    getProductos: jest.fn().mockResolvedValue(productos),
    getProductoById: jest.fn().mockImplementation(async (id) => productos.find(p => p.id === Number(id))),
    crearProducto: jest.fn().mockResolvedValue({ id: 3, titulo: 'Nuevo', descripcion: 'Nuevo', precio: 15, stock: 10, imagen: 'n.png' }),
    actualizarProducto: jest.fn().mockImplementation(async (id, data) => ({ id: Number(id), ...data })),
    eliminarProducto: jest.fn().mockResolvedValue(undefined),
  };
});

// Mock de la conexión a DB para controllers que la usan (perfilController, authController)
jest.mock('../db', () => {
  return {
    query: jest.fn().mockImplementation(async (sql, params) => {
      // Respuestas básicas para SELECT * FROM usuarios usados en perfil
      if (typeof sql === 'string' && /FROM\s+usuarios/i.test(sql)) {
        return {
          rows: [
            { id: 1, nombre: 'John', correo: 'john@example.com', tipo_usuario: 'admin' },
            { id: 2, nombre: 'Jane', correo: 'jane@example.com', tipo_usuario: 'user' },
          ],
        };
      }
      // Por defecto una respuesta vacía
      return { rows: [] };
    }),
  };
});

// Importar la app de tu repo (esto inicia el server internamente, por eso ajustamos Jest config)
const app = require('../app');

describe('Backend - Rutas básicas y protegidas', () => {
  it('GET / debe responder 200 y el texto "API de productos funcionando"', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.text).toContain('API de productos funcionando');
  });

  it('GET /api/productos devuelve 200 y un arreglo JSON de productos (mock)', async () => {
    const res = await request(app)
      .get('/api/productos')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('precio');
  });

  it('GET /api/auth/perfil con JWT válido devuelve 200 y usuarios (mock)', async () => {
    // Crear un token válido conforme a tu middleware y generateToken (id, correo, tipo_usuario, nombre)
    const token = jwt.sign(
      { id: 1, correo: 'john@example.com', tipo_usuario: 'admin', nombre: 'John' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('usuarios');
    expect(Array.isArray(res.body.usuarios)).toBe(true);
    // Validación básica del mock
    expect(res.body.usuarios[0]).toHaveProperty('correo', 'john@example.com');
  });

  it('GET /api/auth/perfil sin token devuelve 401', async () => {
    const res = await request(app)
      .get('/api/auth/perfil')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(res.body).toHaveProperty('error');
  });
});