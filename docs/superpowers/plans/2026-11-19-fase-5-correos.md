# Fase 5 · Correos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Todos los correos de GoQR salen con la marca, desde Functions vía Resend, y los enlaces de verificar/restablecer apuntan a goqr.com.do en vez de firebaseapp.com.

**Architecture:** Un módulo `mail.ts` en Functions renderiza plantillas HTML (`layout.html` + un cuerpo por correo, reemplazo de `{{variables}}` con escape) y envía con Resend sin lanzar errores. Los disparadores existentes (creación de usuario, webhook de Stripe, transferencias, revisión diaria) llaman a `sendMail` después de confirmar su escritura. Verificar y restablecer pasan a callables que generan el enlace con el Admin SDK y lo reescriben a `https://goqr.com.do/...?mode=…&oobCode=…`, que las páginas actuales ya entienden.

**Tech Stack:** Firebase Functions v2 (Node 22, TS), Resend (ya instalado), Admin SDK; Web React + Firebase JS SDK (`httpsCallable`).

**Spec:** `Web/docs/superpowers/specs/2026-11-19-goqr-relaunch-design.md` (sección "Correos", ciclo de pagos, "Verificar el correo no bloquea"). Diseños: `Web/docs/design/Email*.dc.html`.

## Global Constraints

- Remitente `GoQR <no-reply@goqr.com.do>`; `replyTo: contacto@goqr.com.do`.
- GoQR **no tiene WhatsApp**: quitar `[YOUR WHATSAPP]` y toda mención a WhatsApp de los diseños; el contacto es `contacto@goqr.com.do`.
- No existe página de preferencias de correo: el pie no lleva "Preferencias de correo".
- Copias en español (RD), con tildes; montos `RD$2,520.00` / `US$42.00`; fechas en es-DO, zona `America/Santo_Domingo` (ej. "19 de noviembre de 2026").
- Enlaces absolutos a `https://goqr.com.do`.
- Un correo que falla nunca rompe ni revierte la operación que lo dispara: se envía después del commit y los errores solo se registran.
- Plantillas en `Functions/functions/src/templates/`, leídas con `path.join(process.cwd(), 'src/templates', …)` (patrón actual).
- Toda variable insertada en HTML se escapa.
- Functions: nunca tocar ni hacer stage del WIP del usuario (`package.json`, `package-lock.json`, `src/connection.ts`, `src/modules/images.ts`, `src/modules/products.ts`, `src/helpers.ts`, `src/types/`); `git add` con rutas exactas. Rama `fase-5` desde `main` (Functions) y desde `master` (Web).
- Commits terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Nunca push.
- Solo se prueba lógica pura (regla del proyecto); I/O de callables/triggers no.

## Review Focus

1. Stripe reenvía el mismo evento → un solo correo (Task 3: enviar solo si la transacción aplicó el evento).
2. Nombres con `<`, `&`, comillas (restaurante, dueño, motivo de rechazo) → se ven literales, nunca HTML (Task 1).
3. La revisión diaria corre dos veces el mismo día o se reintenta → un solo aviso (Task 4: `reminderFor`).
4. Dueño borrado o sin correo → se omite el correo sin romper el trigger (Task 1: `ownerEmail` → `null`).
5. Restablecer contraseña con un correo que no existe → misma respuesta que uno existente (Task 2).

---

### Task 1: Núcleo de correo y plantillas

**Files:**
- Create: `Functions/functions/src/modules/mail.ts`, `Functions/functions/src/modules/mail.test.ts`
- Create: `Functions/functions/src/templates/layout.html` y un cuerpo por plantilla: `welcome.html`, `verify.html`, `reset.html`, `trial-ending.html`, `period-ending.html`, `paused.html`, `payment-received.html`, `payment-failed.html`, `transfer-received.html`, `transfer-approved.html`, `transfer-rejected.html`, `admin-new-transfer.html`
- Delete: `Functions/functions/src/templates/welcome-email.html` (Task 2 deja de usarlo; bórralo en Task 2)

**Interfaces:**
- Produces:
  - `type EmailTemplate = 'welcome'|'verify'|'reset'|'trial-ending'|'period-ending'|'paused'|'payment-received'|'payment-failed'|'transfer-received'|'transfer-approved'|'transfer-rejected'|'admin-new-transfer'`
  - `EMAILS: Record<EmailTemplate, { subject: string; preheader: string; vars: string[] }>` — `subject`/`preheader` pueden llevar `{{var}}`.
  - `escapeHtml(s: string): string`
  - `renderEmail(t: EmailTemplate, vars: Record<string, string>): { subject: string; html: string; text: string }` — lanza si falta una variable de `EMAILS[t].vars`; `text` = versión sin etiquetas.
  - `sendMail(to: string, t: EmailTemplate, vars: Record<string, string>): Promise<boolean>` — Resend con remitente/replyTo de las constraints; registra y devuelve `false` si falla; nunca lanza.
  - `ownerEmail(userId: string | undefined): Promise<string | null>` — `auth.getUser`; `null` si no existe o no tiene correo.
  - `money(amount: number, currency: 'DOP'|'USD'): string`, `dateEs(d: Date): string`
  - `APP_URL = 'https://goqr.com.do'`

Copias: tomar de `Web/docs/design/Email*.dc.html` aplicando las Global Constraints, y estos ajustes:
- Asuntos: los del diseño. `period-ending`: "Tu plan de GoQR vence en 3 días". `paused`: "Tu menú de GoQR está en pausa". `transfer-rejected`: "No pudimos validar tu transferencia". `admin-new-transfer`: "[Admin] Comprobante pendiente · {{establishment}}".
- `welcome`: sin nombre usa "¡Bienvenido a GoQR!"; la línea de prueba dice "Tu prueba gratis de 30 días empieza con tu primer menú. No hace falta tarjeta."
- `verify`: sin línea de vencimiento; enlace de respaldo = `{{link}}`.
- `reset`: "El enlace vence en 1 hora y solo se puede usar una vez."
- `trial-ending`: sin "Visitas a tu menú" (llega en fase 7); queda "Platos publicados {{dishes}}".
- `period-ending`: mismo esqueleto que trial-ending, título "Tu plan vence el {{date}}", CTA "Renovar mi plan" → `/dashboard/billing`.
- `paused`: título en `{{headline}}` (Task 4 pasa "Tu prueba terminó y tu menú está en pausa" o "Tu plan venció y tu menú está en pausa"); resto como `EmailTrialEnded`.
- `payment-received` / `payment-failed`: sin "terminada en [0000]" (el método dice "Tarjeta" o "Transferencia").
- `transfer-rejected`: la línea de estado va en `{{statusLine}}` (Task 3 decide el texto).
- Maquetación apta para correo: tablas, estilos en línea, ancho 600 px, fuentes con respaldo `Arial, sans-serif`, colores de la marca del diseño.

- [ ] **Step 1: Tests** en `mail.test.ts`:
  - `escapeHtml('<b>&"\'')` → `'&lt;b&gt;&amp;&quot;&#39;'`
  - `renderEmail('transfer-rejected', {...vars, reason: '<script>x</script>'}).html` contiene `&lt;script&gt;` y no `<script>`
  - para cada plantilla de `EMAILS`: renderizar con sus `vars` = `'X'` → `html`, `subject` y `text` no contienen `{{`; `html` contiene `contacto@goqr.com.do` y no contiene `WhatsApp`
  - `renderEmail('welcome', {})` con una variable requerida faltante lanza
  - `money(2520,'DOP')` → `'RD$2,520.00'`; `money(42,'USD')` → `'US$42.00'`
  - `dateEs(new Date('2026-11-19T12:00:00Z'))` → `'19 de noviembre de 2026'`
- [ ] **Step 2:** `npx vitest run src/modules/mail.test.ts` → falla.
- [ ] **Step 3:** Implementar `mail.ts`, `layout.html` (`{{preheader}}`, `{{body}}`, pie GoQR · Santo Domingo, República Dominicana · contacto@goqr.com.do) y los 12 cuerpos.
- [ ] **Step 4:** `npm run build && npx vitest run` → pasa.
- [ ] **Step 5:** Commit `feat(correos): núcleo de correo y plantillas con la marca`.

### Task 2: Bienvenida, verificar y restablecer

**Files:**
- Modify: `Functions/functions/src/modules/auth.ts`, `Functions/functions/src/index.ts`
- Create: `Functions/functions/src/modules/authMail.ts`, `authMail.test.ts`
- Delete: `Functions/functions/src/templates/welcome-email.html`

**Interfaces:**
- Consumes: `sendMail`, `APP_URL` (Task 1).
- Produces:
  - `actionLink(firebaseLink: string, kind: 'verify'|'reset'): string` → `${APP_URL}/verify?mode=verifyEmail&oobCode=<code>` / `${APP_URL}/reset-password?mode=resetPassword&oobCode=<code>`; lanza si el enlace no trae `oobCode`.
  - `canSend(lastSentAt: Date | null, now: Date): boolean` — 60 s entre correos.
  - Callables `sendVerificationEmail()` y `sendPasswordReset({ email })`, exportados en `index.ts`.

Comportamiento:
- `onUserCreated`: envía `welcome` (`name` = primer nombre de `displayName` o vacío). Si `!user.emailVerified` y el proveedor es contraseña, envía también `verify` con `actionLink(await auth.generateEmailVerificationLink(email), 'verify')`. Ya no lanza al fallar.
- `sendVerificationEmail`: exige sesión; si ya está verificado devuelve `{ ok: true }` sin enviar; si no, aplica el límite y envía `verify`.
- `sendPasswordReset({ email })`: valida formato (`HttpsError('invalid-argument', 'Correo inválido.')`); aplica el límite por correo **antes** de buscar al usuario; si el usuario no existe devuelve `{ ok: true }` igual que si existiera; si existe, envía `reset` con `actionLink(await auth.generatePasswordResetLink(email), 'reset')`.
- Límite: doc `mail-throttle/{sha256(kind + ':' + emailMinúsculas)}` con `lastSentAt`; si `!canSend` → `HttpsError('resource-exhausted', 'Espera un minuto antes de pedir otro correo.')`.

- [ ] **Step 1: Tests** `authMail.test.ts`:
  - `actionLink('https://goqr-914b1.firebaseapp.com/__/auth/action?mode=verifyEmail&oobCode=ABC&apiKey=k&lang=es', 'verify')` → `'https://goqr.com.do/verify?mode=verifyEmail&oobCode=ABC'`
  - igual con `'reset'` → `'https://goqr.com.do/reset-password?mode=resetPassword&oobCode=ABC'`
  - sin `oobCode` lanza
  - `canSend(null, now)` true; `canSend(now - 30 s, now)` false; `canSend(now - 61 s, now)` true
- [ ] **Step 2:** Falla → **Step 3:** implementar → **Step 4:** `npm run build && npx vitest run` pasa.
- [ ] **Step 5:** Commit `feat(correos): bienvenida, verificación y restablecer desde goqr.com.do`.

### Task 3: Correos de pagos y transferencias

**Files:**
- Modify: `Functions/functions/src/modules/payments.ts`, `Functions/functions/src/modules/transfers.ts`
- Create: `Functions/functions/src/modules/billingMail.ts`, `billingMail.test.ts`

**Interfaces:**
- Consumes: `sendMail`, `ownerEmail`, `money`, `dateEs`, `APP_URL` (Task 1); `PLANS` (`plans.ts`); `Billing` (`billing.ts`).
- Produces (puros, en `billingMail.ts`):
  - `paymentReceivedVars(p: { establishment: string; plan: PlanId; amount: number; currency: 'DOP'|'USD'; method: 'card'|'transfer'; paidAt: Date; periodEnd: Date | null; invoiceNumber: string; invoiceUrl: string | null }): Record<string, string>` — `invoiceUrl` nulo → `${APP_URL}/dashboard/billing`; `periodEnd` nulo (de por vida) → período "De por vida".
  - `paymentFailedVars(p: { plan: PlanId; amount: number; currency: 'DOP'|'USD'; nextAttempt: Date | null; pauseOn: Date | null }): Record<string, string>` — `pauseOn` = `currentPeriodEnd + GRACE_DAYS`.
  - `rejectedStatusLine(b: { isActive: boolean; currentPeriodEnd: Date | null }): string` → activo con fecha: "Tu menú sigue activo hasta el {fecha} mientras lo resolvemos."; si no: "Tu menú está en pausa hasta que confirmemos tu pago."

Comportamiento:
- Webhook: enviar `payment-received` en `invoice.paid` y en `checkout.session.completed` de pago único (de por vida); `payment-failed` en `invoice.payment_failed`. **Solo si la transacción aplicó el evento** (no si el marcador `stripe-events/{id}` ya existía ni si el evento se ignoró). Enviar después del commit; el webhook responde 200 aunque el correo falle. Número de factura: `invoice.number` o el id de la factura/sesión.
- `onTransferCreated`: si pasa la validación, enviar `transfer-received` al dueño y `admin-new-transfer` a `contacto@goqr.com.do` (reemplaza el texto plano actual; enlace `${APP_URL}/admin/transfers`).
- `reviewTransfer`: tras el commit, `transfer-approved` (monto y "activo hasta" = nuevo `currentPeriodEnd`, o "De por vida") o `transfer-rejected` (`reason`, `statusLine` = `rejectedStatusLine` del establecimiento, CTA `${APP_URL}/dashboard/billing/transfer`).

- [ ] **Step 1: Tests** `billingMail.test.ts`: `paymentReceivedVars` con anual DOP → monto `'RD$2,520.00'`, plan `'Anual'`; con `invoiceUrl: null` → enlace a `/dashboard/billing`; con `periodEnd: null` → contiene `'De por vida'`. `paymentFailedVars` con `pauseOn` → fecha en es-DO. `rejectedStatusLine` en los dos casos con el texto exacto de arriba.
- [ ] **Step 2–4:** Falla → implementar → `npm run build && npx vitest run` pasa.
- [ ] **Step 5:** Commit `feat(correos): recibos, pago fallido y transferencias`.

### Task 4: Avisos de la revisión diaria

**Files:**
- Modify: `Functions/functions/src/modules/billingDaily.ts`, `billingState.ts`, `billingState.test.ts`, `billing.ts` (añadir `reminderFor?: string | null` a `Billing`)

**Interfaces:**
- Consumes: `sendMail`, `ownerEmail`, `dateEs` (Task 1); `dailyTransition` (existente).
- Produces: `reminderDue(b: Billing, now: Date): { template: 'trial-ending'|'period-ending'; endsAt: Date } | null`.

Comportamiento:
- `reminderDue`: `trialing` con `trialEndsAt` en `(now, now + 3 días]` → `trial-ending`; `active` con `method === 'transfer'`, plan ≠ lifetime y `currentPeriodEnd` en `(now, now + 3 días]` → `period-ending`. Nunca para tarjeta (Stripe renueva sola). `null` si `b.reminderFor === endsAt.toISOString()`.
- En `billingDaily`, por documento: dentro de la transacción escribir `billing.reminderFor = endsAt.toISOString()` si toca aviso, o aplicar la pausa de `dailyTransition`; después del commit enviar `trial-ending`/`period-ending` (`date`, `dishes` = cantidad de productos con `establishmentId` y `deletedAt == null`) o `paused` (`headline` según venía de `trialing` o de un plan).
- La consulta actual ya trae `trialing`/`active`/`past_due`; no cambia.

- [ ] **Step 1: Tests** en `billingState.test.ts`: prueba que termina en 2 días → `trial-ending`; en 5 días → `null`; ya vencida → `null`; mismo caso con `reminderFor` igual → `null`; transferencia activa que vence en 3 días → `period-ending`; tarjeta activa que vence en 1 día → `null`; de por vida → `null`.
- [ ] **Step 2–4:** Falla → implementar → `npm run build && npx vitest run` pasa.
- [ ] **Step 5:** Commit `feat(correos): avisos de vencimiento y de menú en pausa`.

### Task 5: Web usa los correos nuevos

**Files:**
- Modify: `Web/src/services/auth.ts`, `Web/firestore.rules`, `Web/tests/rules/firestore.test.ts`

**Interfaces:**
- Consumes: callables `sendVerificationEmail`, `sendPasswordReset` (Task 2).

Comportamiento:
- `createAccount`: ya no llama a `sendEmailVerification` (el trigger lo envía); conserva el `setDoc` de `migrated-users`.
- `sendVerificationEmail()` → `httpsCallable(functions, 'sendVerificationEmail')()`.
- `sendResetPasswordEmail(email)` → `httpsCallable(functions, 'sendPasswordReset')({ email })`.
- Los llamadores (VerifyEmailBanner, VerifyEmailPage, ForgotPasswordPage) muestran el mensaje del `HttpsError` cuando es `functions/resource-exhausted`; revisar que sigan funcionando con la nueva firma.
- Reglas: añadir `'mail-throttle'` a la exclusión del comodín de lectura; sin reglas de escritura (solo Admin SDK).

- [ ] **Step 1: Test de reglas:** usuario autenticado y anónimo no pueden leer ni escribir `mail-throttle/x`.
- [ ] **Step 2:** `npm run test:rules` → falla.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npx tsc -b && npx vitest run && npm run test:rules` pasan.
- [ ] **Step 5:** Commit `feat(cuenta): verificar y restablecer con los correos de GoQR`.

---

## Fuera de esta fase

- **Resumen semanal**: depende de las estadísticas de Umami → fase 7.
- Plantillas de correo de Firebase Auth: quedan sin uso; no hace falta cambiarlas.

## Antes de desplegar (usuario)

1. Confirmar que `goqr.com.do` está verificado en Resend (hoy la bienvenida ya sale desde `no-reply@goqr.com.do`).
2. Desplegar reglas: `npx firebase-tools@13 deploy --only firestore:rules` desde `Web`.
3. Desplegar Functions **antes** que Web (Web llama a los callables nuevos).
