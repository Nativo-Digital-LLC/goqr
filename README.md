# GoQR - Sistema de Gestión de Menú Digital

## Descripción
GoQR es una aplicación web para la gestión de menús digitales: los restaurantes y establecimientos de comida administran su menú y lo ofrecen a sus clientes con un código QR.

## Tecnologías Principales
- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Tailwind CSS
- **Estado**: Zustand
- **Backend**: Firebase (Authentication, Firestore, Storage, Hosting) y Cloud Functions (repo aparte)
- **Pagos**: Stripe (tarjeta) y transferencias con comprobante
- **Búsqueda**: Meilisearch
- **Monitoreo**: Sentry
- **Routing**: React Router DOM
- **Fechas**: Day.js

## Requisitos del Sistema
- Node.js (versión compatible con React 18)
- npm

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd goqr
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno. Crear un archivo `.env` en la raíz con:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_APP_MEILI_SEARCH_HOST=
VITE_APP_MEILI_SEARCH_KEY=   # clave de solo búsqueda
VITE_APP_SENTRY_DSN=
```

## Scripts Disponibles

- `npm run dev`: servidor de desarrollo
- `npm run build`: compila para producción
- `npm run lint`: ejecuta el linter
- `npm run preview`: previsualiza la versión de producción
- `npm test`: pruebas unitarias
- `npm run test:rules`: pruebas de reglas de Firestore y Storage (emuladores)

## Estructura del Proyecto

```
goqr/
├── src/            # Código de la aplicación
├── public/         # Archivos públicos
├── docs/           # Specs y planes
├── tests/          # Pruebas de reglas
├── firestore.rules, storage.rules, firestore.indexes.json
└── firebase.json
```

## Operación
Pasos manuales fuera del código (los secretos y despliegues los hace una persona con acceso):

1. **Hosting**: se despliega con GitHub Actions al hacer push a `master`.
2. **Functions**: se despliegan con GitHub Actions desde el repo de Functions al hacer push a `main`. Los secretos del `.env` de Functions salen de los secrets de GitHub: `RESEND_API_KEY`, `MEILI_ADMIN_KEY`, `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET`.
3. **Reglas e índices** (después de que las pestañas abiertas recarguen): `npx firebase-tools@13 deploy --only firestore:rules,firestore:indexes,storage`.
4. **Stripe**: registrar el endpoint del webhook (`stripeWebhook`) con los eventos configurados y activar el Customer Portal (tarjeta, recibos, cancelar). Probar primero en modo prueba.
5. **Cloud Scheduler**: habilitarlo en el proyecto si el primer deploy de `billingDaily` lo pide.
6. **Administradores**: asignar el permiso con el script de Functions `setAdmin <correo>` (custom claim `admin: true`).
7. **Clientes existentes**: ejecutar `setupBilling` primero sin `--apply` (simulación) y luego con `--apply`, a partir de `billing-clients.json`.
8. **Meilisearch**: el cliente usa solo una clave de búsqueda; la clave de administración vive en `MEILI_ADMIN_KEY`. Rotar la clave pública si tenía permisos de escritura.
9. **Imágenes**: las nuevas se comprimen solas. Para las existentes, ejecutar el script de compresión (muestra visual, respaldo, aplicar).
10. **Transferencias**: se revisan en `/admin` (aprobar o rechazar con motivo). El NCF se emite aparte.

## Características Principales
- Menú público en `/m/:slug` con español/inglés, búsqueda y horarios
- Panel para editar menú, establecimiento y código QR
- Planes y pagos con tarjeta o transferencia
- Panel de administración con métricas
- Correos transaccionales
- Imágenes comprimidas en WebP

## Contribución
1. Fork del proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit de los cambios
4. Push a la rama
5. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia [TIPO_DE_LICENCIA] - ver el archivo LICENSE.md para más detalles.

## Contacto
[INFORMACIÓN_DE_CONTACTO]
