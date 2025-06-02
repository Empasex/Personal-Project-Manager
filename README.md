# Personal-Project-Manager
Es un sitio web el cual esta implementado con los servicios de AWS (Cognito-S3-Beanstalk-CloudFront y RDS)

Aplicación full-stack para gestionar proyectos personales. Permite a cada usuario autenticado crear, ver y administrar sus propios proyectos, usando autenticación con AWS Cognito, backend en Node.js/Express, frontend en React y base de datos MySQL (RDS).

## Características

- Autenticación segura con AWS Cognito.
- Cada usuario solo puede ver y gestionar sus propios proyectos.
- CRUD de proyectos: crear, editar, eliminar y listar.
- Estado del proyecto: Pendiente, En Progreso, Realizado.
- Despliegue en AWS (Beanstalk, S3, CloudFront, RDS).

## Tecnologías

- **Frontend:** React (JavaScript)
- **Backend:** Node.js, Express
- **Base de datos:** MySQL (AWS RDS)
- **Autenticación:** AWS Cognito
- **Infraestructura:** AWS S3, CloudFront, Elastic Beanstalk

## Instalación local

### Requisitos

- Node.js y npm
- MySQL local o acceso a una instancia RDS

### Backend

1. Ve a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en `.env` (ver ejemplo en el repo).
4. Inicia el backend:
   ```bash
   npm start
   ```

### Frontend

1. Ve a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia el frontend:
   ```bash
   npm start
   ```

## Despliegue en AWS

- El frontend se despliega en S3 + CloudFront.
- El backend se despliega en Elastic Beanstalk.
- La base de datos está en RDS.
- Consulta [`infrastructure/aws-setup.md`](infrastructure/aws-setup.md) para instrucciones detalladas.

## Uso

1. Accede a la app y haz login con Cognito.
2. Al ingresar por primera vez, se te pedirá un nombre de usuario.
3. Crea, edita o elimina tus proyectos.
4. Solo puedes ver tus propios proyectos.

## Estructura del proyecto

```
personal-project-manager/
│
├── backend/      # Node.js/Express API
├── frontend/     # React app
├── infrastructure/ # Scripts y docs de AWS
└── README.md
```

## Licencia

MIT
