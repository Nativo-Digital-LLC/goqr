# Changelog

## 0.6.0 · 2026-11-19 · Relanzamiento, fase 0 (base y seguridad)

### Seguridad
- Reglas de Firestore por propietario: cada dueño solo escribe los productos, categorías y subcategorías de sus establecimientos. El cliente ya no puede escribir `billing`, `isActive` ni `userId`, ni borrar su marcador `migrated-users`.
- Reglas de Storage (`storage.rules`, nuevas): las imágenes se suben a `uploads/{uid}/` (solo imágenes, menos de 10 MB) y los comprobantes van a `proofs/{uid}/`, privados. Las imágenes viejas de la raíz siguen siendo públicas.
- El navegador ya no escribe en Meilisearch; lo hace el servidor.

### Cambios
- `createAccount` ya no llama a `sendWelcomeEmail`; el correo lo envía el servidor.
- `createEstablishment` ya no escribe `isActive`; lo asigna el servidor junto con la prueba de 30 días.
- `uploadFile` sube a `uploads/{uid}/` y el límite de imagen en el cliente es de 10 MB.
- Hosting: `Cache-Control: no-cache` para el HTML y las rutas del SPA. Se agregan `.firebaserc` y la configuración de reglas y emuladores en `firebase.json`.

### Base técnica
- Tailwind v4, shadcn/ui y los tokens de la marca nueva (Bricolage Grotesque + DM Sans). La interfaz actual no cambia; sus colores viejos pasan a `legacy`.
- Pruebas: `npm test` (vitest) y `npm run test:rules` (reglas con emuladores).
- Diseño y plan en `docs/superpowers/`.
