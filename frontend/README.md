# Gestor de Proyectos Personales Frontend

Esta es la parte frontend de la aplicación Gestor de Proyectos Personales, construida con React y TypeScript. La aplicación permite a los usuarios gestionar sus proyectos de manera efectiva.

## Comenzando

Para comenzar con la aplicación frontend, sigue estos pasos:

1. **Clona el repositorio**:
   ```
   git clone <repository-url>
   cd personal-project-manager/frontend
   ```

2. **Instala las dependencias**:
   ```
   npm install
   ```

3. **Ejecuta la aplicación**:
   ```
   npm start
   ```

   Esto iniciará el servidor de desarrollo y abrirá la aplicación en tu navegador predeterminado.

## Estructura de Carpetas

- `src/`: Contiene el código fuente de la aplicación.
  - `App.tsx`: El componente principal que configura el enrutamiento y el layout.
  - `components/`: Contiene componentes reutilizables.
    - `ProjectList.tsx`: Muestra la lista de proyectos.
  - `pages/`: Contiene las páginas principales de la aplicación.
    - `Dashboard.tsx`: La página principal del panel.
  - `services/`: Contiene funciones de servicios API para la comunicación con el backend.
    - `api.ts`: Funciones para realizar llamadas a la API.
  - `types/`: Contiene interfaces TypeScript para la seguridad de tipos.

## Tecnologías Utilizadas

- React
- TypeScript
- Axios (para llamadas a la API)

## Contribuciones

Si deseas contribuir a este proyecto, por favor haz un fork del repositorio y envía un pull request con tus cambios.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.