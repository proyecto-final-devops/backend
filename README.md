# Backend

## Construcción y ejecución con Docker

1. Construir la imagen Docker:
   ```bash
   docker build -t backend .
   ```

2. Ejecutar el contenedor:
   ```bash
   docker run -p 3000:3000 backend
   ```

El backend estará disponible en `http://localhost:3000`.
