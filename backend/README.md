# Gestor de Proyectos Personales Backend

Este es el backend de la aplicación Gestor de Proyectos Personales, construido con Node.js, Express y MySQL. El backend funciona como la API para gestionar proyectos, permitiendo a los usuarios crear, leer, actualizar y eliminar sus proyectos.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Instalación

1. Clona el repositorio:
   ```
   git clone <repository-url>
   cd personal-project-manager/backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura tu base de datos MySQL y actualiza los datos de conexión en la aplicación.

4. Ejecuta la aplicación:
   ```
   npm start
   ```

## Uso

Una vez que el backend esté en funcionamiento, puedes interactuar con la API usando herramientas como Postman o a través de la aplicación frontend. El backend gestionará las solicitudes para administrar los proyectos.

## Endpoints de la API

- `POST /projects` - Crear un nuevo proyecto
- `GET /projects` - Obtener todos los proyectos
- `PUT /projects/:id` - Actualizar un proyecto por ID
- `DELETE /projects/:id` - Eliminar un proyecto por ID

## Tecnologías Utilizadas

- Node.js
- Express
- MySQL
- TypeScript

Este backend está diseñado para funcionar perfectamente con la aplicación frontend, proporcionando una solución robusta para la gestión de proyectos personales.