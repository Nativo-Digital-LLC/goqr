# GoQR - Sistema de Gestión de Menú Digital

## Descripción
GoQR es una aplicación web moderna para la gestión de menús digitales, permitiendo a los restaurantes y establecimientos de comida gestionar sus menús de manera eficiente y ofrecer una experiencia digital a sus clientes.

## Tecnologías Principales
- **Frontend Framework**: React 18
- **Lenguaje**: TypeScript
- **Bundler**: Vite
- **Estilos**: Tailwind CSS
- **UI Components**: Ant Design
- **Estado**: Zustand
- **Backend**: Appwrite
- **Búsqueda**: Meilisearch
- **Monitoreo**: Sentry
- **Routing**: React Router DOM
- **Notificaciones**: SweetAlert2
- **Manejo de Fechas**: Day.js

## Requisitos del Sistema
- Node.js (versión compatible con React 18)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd goqr
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_MEILISEARCH_HOST=
VITE_SENTRY_DSN=
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Previsualiza la versión de producción

## Estructura del Proyecto

```
goqr/
├── src/
│   ├── assets/         # Recursos estáticos
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── services/      # Servicios y APIs
│   └── utils/         # Utilidades y helpers
├── public/            # Archivos públicos
├── dist/             # Build de producción
└── [archivos de configuración]
```

## Características Principales
- Gestión de menús digitales
- Sistema de búsqueda en tiempo real
- Interfaz de usuario moderna y responsiva
- Gestión de productos y categorías
- Sistema de autenticación
- Monitoreo de errores
- Optimización de rendimiento

## Contribución
1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia [TIPO_DE_LICENCIA] - ver el archivo LICENSE.md para más detalles.

## Contacto
[INFORMACIÓN_DE_CONTACTO]
