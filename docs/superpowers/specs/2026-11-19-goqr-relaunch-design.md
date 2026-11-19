# GoQR — Relanzamiento: diseño técnico

Fecha: 2026-11-19 · Diseño visual aprobado: https://claude.ai/artifact/TM3ivt2CY6X82545dauXLh (45 artboards, 8 páginas)

## Intención

GoQR tiene ~5 clientes que pagan y validan el producto. El objetivo del relanzamiento es **conseguir restaurantes nuevos** (prioridad 1), **cobrar sin perseguir a nadie** (2) y que **cada menú se vea premium** (3). La marca nueva ("C disciplinada sobre base neutra") fue decidida por un consejo de 4 modelos por impacto, no por gusto.

Éxito: un dueño llega a la landing, crea su cuenta, tiene su menú con QR en ≤10 minutos, y al terminar la prueba de 30 días paga solo (tarjeta o transferencia) sin que nadie intervenga salvo para aprobar transferencias.

## Metas

1. Rehacer toda la web (landing, auth, onboarding, menú público móvil + escritorio, panel, pagos, admin) según el canvas, con **shadcn/ui**, retirando antd, @ant-design/icons, sweetalert2 e instantsearch.css.
2. Pagos self-service: Stripe Checkout + Customer Portal; transferencia con comprobante aprobada desde un admin interno.
3. Ciclo de prueba/suscripción automático (prueba 30 días → pausa del menú → reactivación al pagar).
4. 11 correos transaccionales con la marca (Resend).
5. Compresión real de imágenes en el servidor.
6. Estadísticas desde Umami en el panel y por correo semanal.

## No-metas

- Pedidos/carrito, POS, reservas.
- UepaPay, PortalDom y PayPal (posibles más adelante como enlaces; `paymentUrl` ya existe en `bills`).
- Personalización de tipografía/tema del menú por restaurante más allá de color, logo y banner.
- Importar menú desde foto.
- Retirar el login dual Appwrite → Firebase (se conserva tal cual).
- Pantalla de Ayuda (el enlace del panel abre WhatsApp/correo de soporte).

## Anti-metas (fracaso aunque "funcione")

- Romper los 5 menús en producción o los QR ya impresos (`/m/:slug` debe seguir respondiendo igual).
- Que un dueño pueda activarse sin pagar o editar el menú de otro.
- Que Meilisearch y Firestore se desincronicen.

## Restricciones

- Sub-repos independientes: `Web/` (Vite + React 18 + TS) y `Functions/functions/` (Node 22, v2). `Functions` tiene cambios sin commitear del usuario: **no descartarlos**; trabajar en rama.
- Firestore es público para lectura; todo dato nuevo será visible para cualquiera salvo colecciones con reglas propias.
- Copia en español (RD), tabs en el código Web, soft-delete con `deletedAt`, nombres bilingües `es_`/`en_`.
- Patrón de hooks `useXxx() → [handler, loading, error]`.

## Enfoques considerados

| | Enfoque | Trade-off |
|---|---|---|
| **A (elegido)** | Rehacer la UI **en el mismo proyecto Vite**, en una rama `relaunch`, pantalla por pantalla, con shadcn/ui; servicios, hooks, store y Firebase se reutilizan. | Reutiliza login dual, Meilisearch y Firestore; menús en producción intactos; se puede publicar por fases. Conviven antd y shadcn mientras dura la migración. |
| B | Proyecto nuevo (Next.js) contra el mismo Firebase. | SSR para SEO, pero reescribir y re-probar todo lo que ya funciona; cambia hosting. |
| C | Solo tematizar antd. | Rápido, pero no alcanza la marca ni el menú premium. |

El usuario pidió shadcn y retirar lo actual; A es la vía.

## Decisiones tomadas

### Frontend
- **shadcn/ui sobre Tailwind v4** (actualizar desde 3.4; es lo que shadcn genera hoy). Tokens del canvas → variables CSS shadcn (tabla en el artboard "Sistema de diseño"): `--primary` = cacao #2A1410, `--brand` = tomate #C2381F, `--destructive` = #9F1239, etc.
- Dependencias nuevas (todas las que shadcn usa): `tailwindcss@4`, `@tailwindcss/vite`, `tw-animate-css`, `clsx`, `tailwind-merge`, Radix primitives (vía shadcn), `react-hook-form`, `zod`, `@hookform/resolvers`, `sonner` (toasts), `recharts` (gráficos shadcn), `qrcode` (generar QR sin antd), fuentes `@fontsource-variable/bricolage-grotesque` y `@fontsource-variable/dm-sans` (auto-hospedadas, subset latino). Se eliminan: `antd`, `@ant-design/icons`, `sweetalert2`, `instantsearch.css`, `@tailwindcss/forms`, `@tailwindcss/container-queries`. Se mantiene `react-instantsearch` (hooks, UI propia).
- Rutas nuevas: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify`, `/onboarding`, `/m/:slug` (público, igual URL), `/dashboard` (resumen), `/dashboard/menu`, `/dashboard/establishment`, `/dashboard/qr`, `/dashboard/stats`, `/dashboard/billing`, `/dashboard/billing/transfer`, `/checkout/success`, `/checkout/cancel`, `/admin/transfers`, `/admin/clients`. Rutas viejas redirigen (`/dashboard/menus` → `/dashboard`, `/request-reset-password` → `/forgot-password`, `/change-password-after-request` → `/reset-password`, `/panel/establishments` → `/onboarding` o `/dashboard/establishment`, `/qr/:slug` → `/dashboard/qr`).
- **La edición sale del menú público.** `/m/:slug` ya no muestra controles de edición; el editor vive en `/dashboard/menu` con vista previa.
- Selector de establecimiento en el panel (un usuario puede tener varios; precio por establecimiento).
- El color del restaurante pasa por una función de contraste: si el texto blanco sobre él < 4.5:1, se oscurece para botones/texto y se avisa en el editor.
- QR: codifica `https://goqr.com.do/m/:slug?src=qr` (los QR viejos sin `src` siguen funcionando). Plantillas imprimibles (tarjeta de mesa, sticker, póster A4) generadas en el cliente como PDF/PNG.

### Datos (Firestore)
Campos nuevos en `establishments/{id}` (escritos **solo por Functions**):
`billing: { status: 'trialing'|'active'|'past_due'|'paused'|'canceled', plan: 'monthly'|'annual'|'lifetime'|null, method: 'card'|'transfer'|null, trialEndsAt, currentPeriodEnd, stripeCustomerId, stripeSubscriptionId }`. `isActive` se conserva (lo lee el menú público) y lo deriva Functions de `billing.status`.

Colección nueva `transfers/{id}` (lectura: dueño y admin; no pública): `establishmentId, userId, plan, amount, currency ('DOP'|'USD'), proofPath (Storage privado), declaredDate, reference ('GOQR-xxxx'), status ('pending'|'approved'|'rejected'), reason, reviewedBy, createdAt`.

`bills` se reutiliza como historial de facturas (espejo de invoices de Stripe y de transferencias aprobadas).

`establishments/{id}` añade `type` (restaurante, cafetería, bar, hotel, otro) del onboarding.

Admin = custom claim `admin: true` (se asigna con un script).

### Reglas de seguridad (corrección obligatoria, hoy hay huecos)
Hoy cualquier usuario autenticado puede escribir productos/categorías de cualquier establecimiento, y el dueño puede ponerse `isActive: true`. Nuevas reglas:
- categorías/subcategorías/productos: escritura solo si `get(establishment).data.userId == request.auth.uid`.
- establishments: el cliente no puede crear ni cambiar `billing`, `isActive`, `userId`.
- `transfers`: crear por el dueño con `status == 'pending'`; leer dueño/admin; actualizar solo admin (o solo Functions).
- Storage: `uploads/{uid}/**` escritura del propio uid con límite de tamaño y tipo imagen; `proofs/{uid}/**` privado (dueño + admin).
- `sendWelcomeEmail` deja de ser callable público (pasa a trigger de creación de usuario).

### Pagos
- Stripe en **DOP**: Price mensual recurrente RD$300, anual recurrente RD$2,520, de por vida pago único RD$11,000. Una suscripción por establecimiento (`metadata.establishmentId`).
- Functions: `createCheckoutSession` (callable, verifica dueño), `createPortalSession` (callable), `stripeWebhook` (HTTPS, firma verificada) para `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated|deleted`.
- Transferencia: el dueño sube comprobante → doc `transfers` → correo interno al admin → admin aprueba/rechaza en `/admin/transfers` (callable `reviewTransfer`) → actualiza `billing` + crea `bill` + correo al dueño.
- Ciclo: al crear establecimiento `billing.status='trialing'`, `trialEndsAt = +30 días`. Función programada diaria: 3 días antes → correo "prueba por terminar"; vencida sin pago → `paused` + `isActive=false` + correo. Pago → `active` + `isActive=true`.
- **Clientes existentes (5):** se migran con un script a `billing.status='active'`, `method` y `currentPeriodEnd` según su situación real (el usuario la da); nunca se pausan automáticamente sin revisión.
- Secrets en Functions: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `UMAMI_API_KEY`, `MEILI_SEARCH_KEY` (Secret Manager, `defineSecret`).

### Correos (Resend, `no-reply@goqr.com.do`)
Plantillas HTML en `Functions/functions/src/templates/` con reemplazo de `{{variables}}` (patrón actual), copiadas del canvas (página 8). Disparadores:
| Correo | Disparador |
|---|---|
| Bienvenida | trigger de creación de usuario (Auth) |
| Verificar correo | mismo trigger: `generateEmailVerificationLink` + Resend (reemplaza el de Firebase) |
| Restablecer contraseña | callable `sendPasswordReset` con `generatePasswordResetLink` |
| Prueba por terminar / terminada | función programada diaria |
| Pago recibido / fallido | webhook Stripe |
| Comprobante recibido, transferencia aprobada/rechazada, interno nuevo comprobante | triggers de `transfers` |
| Resumen semanal | programada lunes 8:00 AST, solo si el dueño lo tiene activado (`establishments.weeklyReport`) |

### Imágenes
Trigger de Storage `onObjectFinalized` en `uploads/**` con `sharp`: redimensiona (máx. 1600 px, miniatura 400 px), convierte a WebP q80, guarda en `optimized/`, y actualiza el campo del documento indicado en la metadata del archivo (`collection`, `docId`, `field`); para productos también actualiza Meilisearch (con clave en el servidor). Se elimina el `onCreateProduct` viejo que no comprimía.

### Estadísticas (Umami)
- Callable `getStats(establishmentId, range)` que verifica dueño, consulta la API de Umami Cloud (website `c17de231-…`) filtrando por URL `/m/:slug`, y cachea 1 h en `stats-cache/{establishmentId_range}` (no público).
- Métricas: vistas, visitantes únicos, escaneos (vistas con `src=qr`), horas pico, idioma, dispositivos, categorías/platos más vistos (eventos Umami `Category` ya existe; se añade `Product` al abrir detalle).
- El correo semanal usa la misma función.

## Fases (orden propuesto)

0. **Base y seguridad**: rama `relaunch` en ambos repos; reglas Firestore/Storage; cerrar `sendWelcomeEmail`; Tailwind v4 + shadcn + tokens + fuentes.
1. **Landing + auth + onboarding** (prioridad 1: captación).
2. **Menú público** nuevo (móvil + escritorio), sin edición inline.
3. **Panel**: resumen, editor del menú, establecimiento, QR.
4. **Pagos**: modelo `billing`, Stripe, transferencias, admin, ciclo de prueba, migración de los 5 clientes.
5. **Correos**.
6. **Imágenes**.
7. **Estadísticas** (panel + correo semanal).
8. Retirar antd/sweetalert y código muerto; deploy.

Cada fase termina con build verde y prueba en el navegador; se despliega cuando el usuario lo apruebe.

## Lo que decide el builder
Estructura de componentes, nombres de archivos, división en hooks/servicios siguiendo los patrones existentes, mensajes de error exactos que no estén en el canvas, estrategia de pruebas por fase.

## Datos que necesitamos del usuario (bloquean fases concretas)
- Fase 4: claves Stripe de prueba y producción; situación de pago de los 5 clientes actuales; datos bancarios RD y EE. UU.; WhatsApp de soporte.
- Fase 5: dominio `goqr.com.do` verificado en Resend (confirmar).
- Fase 7: API key de Umami Cloud.

## Decisiones del builder check (mías; revisables)

- **Despliegue por fases.** La fase 0 sale a producción junto con un trigger `onEstablishmentCreated` que pone `billing.status='trialing'`, `trialEndsAt` e `isActive=true`. Así las reglas nuevas, que impiden al cliente escribir `isActive`, no rompen los registros antes de la fase 4. Se quita `isActive: true` de `services/establishments.ts`.
- **Meilisearch pasa al servidor.** Todas las escrituras de productos a Meilisearch (crear, editar, borrar e imagen) se mueven a un trigger de Firestore sobre `products/{id}` con clave de administración en Secret Manager. El cliente queda con una clave de solo búsqueda. Así Firestore y la búsqueda no se desincronizan, y nadie puede escribir en el índice con la clave pública. Hay que rotar la clave actual si tiene permisos de escritura.
- **Verificar el correo no bloquea.** El panel muestra un aviso y botón para reenviar, nada más. Las cuentas migradas desde Appwrite quedan exentas del aviso.
- **Migración de establecimientos existentes.** Los 5 que pagan pasan a `active` con los datos que dé el usuario. Los demás pasan a `billing.status='legacy'`: conservan su `isActive` actual, la función diaria nunca los pausa y aparecen en Admin · clientes para revisarlos a mano.
- **Después de la prueba:**
  - Tarjeta en `past_due`: Stripe reintenta el cobro y el menú sigue visible 7 días; luego pasa a `paused`.
  - Periodo pagado por transferencia que vence: correo 3 días antes, 7 días de gracia y luego `paused`.
  - De por vida: `active` sin `currentPeriodEnd`.

## Respuestas del usuario (2026-11-19)

- **Prueba gratis: una por usuario.** Solo el primer establecimiento del usuario empieza en `trialing`. Los siguientes empiezan en `paused` (se pueden editar, pero el menú público no se ve) hasta que se paguen. El trigger revisa si el `userId` ya tuvo una prueba (`users/{uid}.trialUsedAt`, escrito solo por Functions).
- **Precios en USD (transferencia a cuenta de EE. UU.): fijos.** US$5/mes, US$42/año, US$185 de por vida. Son los del ejemplo, pendientes de que el usuario los confirme; viven en una constante única.
- **NCF: manual.** Se guarda `requiresTaxReceipt` y `rnc`. En Admin, cada factura (`bills`) tiene un campo para subir el PDF del NCF emitido aparte, que se adjunta y se envía al cliente. Sin numeración automática.
