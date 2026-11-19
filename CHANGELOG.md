# Changelog

## 0.8.0 · 2026-11-19 · Relanzamiento, fases 2 y 3 (menú público y panel nuevos)

### Nuevo
- Menú público nuevo en `/m/:slug`: portada, categorías fijas (chips en el celular, lista lateral en la computadora), subcategorías con foto, ficha del plato, búsqueda, español/inglés, abierto/cerrado según el horario, mapa, contacto, redes y aviso de alergias.
- Panel nuevo en `/dashboard` con barra lateral (computadora), barra inferior (celular) y selector de local:
  - Resumen: prueba gratis, checklist para dejar el menú listo y tarjeta del menú.
  - Editor del menú: categorías y subcategorías (crear, editar, ocultar, subir/bajar, borrar con confirmación), productos con búsqueda y reordenar, vista previa en vivo; en el celular, cambio rápido de precio y estado.
  - Producto: foto, nombre y descripción en español e inglés, varios precios (0 = "Gratis", o sin precio), categoría y subcategoría, estado (Visible, Agotado, Oculto) y "Más vendido".
  - Establecimiento: información y enlace, marca (logo, portada, color con aviso de contraste), contacto, horarios, redes, idiomas, aviso de alergias y comprobante fiscal con verificación de RNC. Solo guarda lo que cambió.
  - Código QR: descarga en PNG, SVG y PDF para imprimir; logo al centro, color y texto del marco; plantillas de mesa, sticker y póster; compartir por enlace o WhatsApp.
  - Facturación (lista de facturas) y Estadísticas (próximamente).

### Cambios
- Rutas viejas redirigen: `/dashboard/menus` → `/dashboard`, `/dashboard/invoices` → `/dashboard/billing`, `/panel/establishments` → `/dashboard/establishment`, `/qr/:slug` → `/m/:slug`.
- Los precios guardados como texto (datos viejos) se leen bien en el menú y el panel.
- Crear un producto, categoría o subcategoría ya no renumera el resto.
- Se eliminan el panel viejo, la página QR vieja, los modales de edición y antd/sweetalert2 del código.

## 0.7.0 · 2026-11-19 · Relanzamiento, fase 1 (landing, cuenta y onboarding)

### Nuevo
- Landing nueva con la marca de GoQR: hero, cómo funciona, objeciones, celular y computadora, precios (RD$300 / RD$210 anual / RD$11,000), preguntas frecuentes y cierre. Responsive.
- Ingresar, recuperar contraseña, nueva contraseña y crear cuenta con el diseño nuevo (react-hook-form + zod, errores de Firebase en español, medidor de contraseña).
- Verificar correo con estados pendiente, verificado, vencido y error. No bloquea el uso.
- Onboarding de 4 pasos en `/onboarding`: datos del negocio con enlace propio y comprobación de disponibilidad, marca (logo, portada, color con aviso de contraste), primer plato y QR listo para descargar o compartir. Retoma donde quedó y nunca crea un segundo establecimiento.
- Los enlaces de correo de Firebase se atienden según `mode` en `/verify`, `/reset-password` y las rutas viejas.

### Cambios
- Después de ingresar: sin establecimiento → `/onboarding`; con establecimiento → `/dashboard`.
- La sesión guardada en el navegador se reconcilia con Firebase al iniciar.
- Google guarda la sesión en el store.
- `createEstablishment` devuelve el id y acepta `type`, `onboardingStep` y `exactColor`. `getEstablishmentsByUserId` incluye `id`. `createCategory` devuelve el id.
- Se eliminan la landing, el login, el registro y la verificación viejos (`pages/home`, `pages/containers`, `pages/auth`, `pages/verify-email`).

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
