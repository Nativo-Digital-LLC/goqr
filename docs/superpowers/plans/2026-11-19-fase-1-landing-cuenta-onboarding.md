# Fase 1 · Landing, cuenta y onboarding: plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usa superpowers:subagent-driven-development para implementar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`).

**Objetivo:** reemplazar la landing, el login, el registro, la recuperación de contraseña y la verificación de correo por el diseño aprobado, y agregar el onboarding de 4 pasos que deja a un restaurante nuevo con su menú y su QR en unos 10 minutos.

**Arquitectura:** páginas nuevas en `Web/src/pages/` con componentes shadcn (`src/components/ui`) y componentes de marca en `src/components/brand`. Se reutilizan servicios y hooks existentes (`services/auth.ts`, `services/establishments.ts`, `services/categories.ts`, `services/products.ts`, `hooks/useAuth.ts`, `store/session.ts`). Las páginas viejas que se reemplazan se borran. El panel (`/dashboard/*`), el menú público (`/m/*`, `/qr/*`) y `pages/panel/Establishments.tsx` no se tocan (fases 2 y 3).

**Stack:** React 18, Vite 5, Tailwind v4, shadcn/ui, react-hook-form + zod (ya instalados), sonner, `qrcode` (nuevo), Firebase Auth/Firestore/Storage.

**Spec:** `Web/docs/superpowers/specs/2026-11-19-goqr-relaunch-design.md`
**Diseño (fuente de verdad visual):** `Web/docs/design/*.dc.html` — HTML con estilos inline, abrir y traducir a Tailwind + shadcn. Tokens: `Web/docs/design/SPEC.md` y `src/styles/tokens.css`.

## Restricciones globales

- Tabs en el código. Toda la copia de cara al usuario en español (RD), con acentos, tomada **literal** de los artboards salvo donde este plan diga otra cosa.
- Marketing (landing, auth, onboarding) usa la paleta de marca: crema `#FFF3E6`, tomate `#C2381F` (hover `#A82E18`), plátano `#FFC53D` solo como fondo con texto cacao, cacao `#2A1410`, cacao-2 `#6E4A3E`, línea `#EBD3BC`. Títulos `font-display` (Bricolage Grotesque), texto DM Sans. Gris "powered by" `#766660`. Logo: círculo tomate con cuadro finder crema y punto plátano; wordmark `goqr` (sin "!"). El sticker "Hecho en RD" solo en marketing.
- Componentes nuevos usan `border-border` explícito (no hay regla global de borde todavía).
- Botones de 44 px de alto (`h-11`), radio 12 px; foco visible de 2 px cacao.
- Los artboards tienen textos de menos de 12 px, rellenos apretados y textos con contraste menor a 4.5:1; no copiarlos tal cual: texto mínimo 12 px (14 px en controles), contraste de texto ≥ 4.5:1 (usar `--muted-foreground` o `#766660`, nunca más claro) y tarjetas sin anidar.
- Responsive: cada página se verifica a 390 px y a 1440 px (`LandingMobile.dc.html` es la referencia móvil de la landing).
- Se conserva el login dual Appwrite → Firebase: solo se llama a `login()` / `createAccount()` / `authWithGoogle()` existentes, sin cambiarlos.
- Precios (constante única `src/constants/plans.ts`): mensual RD$300, anual RD$2,520 (RD$210/mes, ahorra 30 %), de por vida RD$11,000; ITBIS incluido; 30 días gratis sin tarjeta.
- No se escriben campos de servidor (`billing`, `isActive`, `userId` en updates); `trialEndsAt` se **lee** de `establishment.billing`.
- Rutas viejas siguen funcionando con su query string (los enlaces de correo de Firebase pueden apuntar a ellas).

## Foco de revisión

1. **Enlaces de correo con `?mode=…&oobCode=…`** llegando a `/verify`, `/reset-password` o a las rutas viejas: deben aplicar el código (verificar/restablecer) o mostrar el estado "enlace vencido" sin pantalla en blanco.
2. **Slug ya usado o inválido** en el paso 1: mensaje claro antes de crear nada; mayúsculas, acentos y espacios se normalizan (`La Roca Ñ` → `la-roca-n`).
3. **Usuario que vuelve a la mitad del onboarding** ("Guardar y salir" o recarga): retoma en el paso guardado sin crear un segundo establecimiento.
4. **Usuario con sesión que entra a `/login` o `/register`**: va a `/onboarding` si no tiene establecimiento, o a `/dashboard` si ya tiene.
5. **Color de marca con poco contraste** (p. ej. `#F5A623`): se muestra el aviso y el color oscurecido para texto; botones y fondos usan el color tal cual.

---

### Task 1: Base de marca y layout de marketing

**Archivos:**
- Crear: `src/components/brand/Logo.tsx`, `src/components/brand/MarketingHeader.tsx`, `src/components/brand/MarketingFooter.tsx`, `src/layouts/MarketingLayout.tsx`
- Modificar: `src/pages/terms.tsx`, `src/pages/privacy-policies.tsx`, `src/pages/404.tsx` (usar `MarketingLayout` en vez de `containers/HomeContainer`)
- Referencia: `docs/design/Landing.dc.html` (header y footer), `LandingMobile.dc.html` (menú móvil), `DesignSystem.dc.html`

**Interfaces:**
- Produce: `<Logo size?: number; withWordmark?: boolean; className?: string />`; `<MarketingLayout>{children}</MarketingLayout>` (header + `<main>` + footer). Header: enlaces a `#como-funciona`, `#precios`, `#preguntas`, "Ingresar" → `/login`, "Prueba gratis" → `/register`; en móvil un `Sheet` con los mismos enlaces.

- [ ] **Paso 1:** implementar los componentes traduciendo el header y el footer del artboard. Las anclas usan scroll suave.
- [ ] **Paso 2:** pasar terms, privacy y 404 a `MarketingLayout`; no cambiar su texto.
- [ ] **Paso 3:** `npm run build` → OK. Revisar en `npm run dev` `/terms` a 390 y 1440 px.
- [ ] **Paso 4:** commit `feat: layout de marketing con la marca nueva`.

### Task 2: Landing

**Archivos:**
- Crear: `src/pages/landing/LandingPage.tsx` y una sección por archivo en `src/pages/landing/sections/` (`Hero`, `SocialProof`, `HowItWorks`, `Objections`, `Showcase`, `Pricing`, `Faq`, `FinalCta`); `src/constants/plans.ts`; `src/constants/landing.ts`
- Modificar: `src/router.tsx` (`/` → `LandingPage`), `index.html` (title y meta description nuevos)
- Eliminar: `src/pages/home/**` y `src/pages/containers/**` si ya nada los importa
- Referencia: `docs/design/Landing.dc.html`, `docs/design/LandingMobile.dc.html`

**Interfaces:**
- Produce: `PLANS: { id: 'monthly'|'annual'|'lifetime'; name: string; priceDop: number; perMonthDop: number; note: string; badge?: string }[]` con monthly 300/300, annual 2520/210 (badge `Ahorras 30%`), lifetime 11000. `TRIAL_DAYS = 30`. `EXAMPLE_MENU_SLUG = 'desayunos-la-roca-restaurant'`. `CLIENT_LOGOS: { name: string; src: string }[] = []` y `TESTIMONIAL: { quote: string; author: string; role: string; restaurant: string } | null = null`.

Decisiones:
- Los marcadores `[LOGO CLIENTE n]`, `[TESTIMONIO…]` y `[PRECIO]` del artboard **no** se muestran: `SocialProof` no renderiza nada mientras `CLIENT_LOGOS` esté vacío y `TESTIMONIAL` sea `null`; en el mockup del menú, el plato con `[PRECIO]` usa `$5`.
- "Ver menú de ejemplo" abre `/m/${EXAMPLE_MENU_SLUG}` en otra pestaña.
- En la respuesta "¿Sirve para algo más que mostrar precios?" el resumen por correo es **semanal** (la spec manda sobre el artboard): "…Y te llega un resumen por correo cada semana."
- Todos los CTA "Crea tu menú gratis" / "Empezar gratis" van a `/register` (los de precios con `?plan=<id>`, que por ahora solo se guarda en `sessionStorage` como `goqr:plan`).
- FAQ con el `Accordion` de shadcn (agregarlo con `npx shadcn@latest add accordion` y pasarlo a tabs).
- title: `GoQR · Menú digital con QR para restaurantes en RD`; description: `Crea tu menú digital con QR en minutos, cámbialo cuando quieras y deja de pagar imprenta. 30 días gratis, sin tarjeta.`

- [ ] **Paso 1:** test `src/constants/plans.test.ts`: anual `priceDop === 2520` y `perMonthDop === 210`; `Math.round((1 - 210 / 300) * 100) === 30`; los tres ids existen.
- [ ] **Paso 2:** `npm test` → FALLA; crear `plans.ts`; `npm test` → PASA.
- [ ] **Paso 3:** implementar las secciones fieles al artboard de escritorio y al móvil.
- [ ] **Paso 4:** borrar `pages/home` y `pages/containers` (comprobar con `grep -r "pages/home\|containers/" src` que nada los importa). `npm run build` → OK.
- [ ] **Paso 5:** commit `feat: landing nueva`.

### Task 3: Layout de cuenta, ingresar, recuperar y nueva contraseña

**Archivos:**
- Crear: `src/layouts/AuthLayout.tsx`; `src/pages/account/LoginPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`; `src/lib/authErrors.ts` + `src/lib/authErrors.test.ts`; `src/lib/postAuth.ts` + `src/lib/postAuth.test.ts`
- Modificar: `src/router.tsx`
- Eliminar: `src/pages/auth/login.tsx`, `request-reset-password.tsx`, `change-password-after-request.tsx`
- Referencia: `docs/design/Login.dc.html`, `ForgotPassword.dc.html`, `ResetPassword.dc.html`

**Interfaces:**
- Consume: `useLogin`, `useRequestResetPasswordEmail`, `useResetPasswordWithSecret` de `hooks/useAuth.ts`; `authWithGoogle` de `services/auth.ts`; `getEstablishmentsByUserId` de `services/establishments.ts`.
- Produce:
  - `authErrorMessage(error: unknown): string` — mapea códigos de Firebase a español: `auth/invalid-credential` y `auth/wrong-password` → `Correo o contraseña incorrectos.`; `auth/user-not-found` → `No hay una cuenta con ese correo.`; `auth/email-already-in-use` → `Ya hay una cuenta con ese correo. Ingresa o recupera tu contraseña.`; `auth/weak-password` → `La contraseña es muy débil.`; `auth/too-many-requests` → `Demasiados intentos. Espera unos minutos y vuelve a intentar.`; `auth/expired-action-code` y `auth/invalid-action-code` → `Este enlace venció o ya se usó. Pide uno nuevo.`; `auth/popup-closed-by-user` → `''` (no mostrar nada); errores de Appwrite (axios 401) → `Correo o contraseña incorrectos.`; cualquier otro → `Algo salió mal. Inténtalo de nuevo.`
  - `postAuthPath(establishments: { onboardingStep?: number | null }[]): '/onboarding' | '/dashboard'` — `/onboarding` si no hay establecimientos o el primero tiene `onboardingStep` entre 1 y 3; si no, `/dashboard`.
  - `useRedirectIfAuthenticated(): void` — si hay sesión, carga los establecimientos del usuario y navega a `postAuthPath(...)` (Foco 4).
- Rutas: `/login`, `/forgot-password`, `/reset-password`. Alias que renderizan la misma página conservando la query: `/request-reset-password` → `ForgotPasswordPage`, `/change-password-after-request` → `ResetPasswordPage`.
- `ResetPasswordPage` lee `oobCode` de la query; sin `oobCode` muestra el estado de enlace vencido con botón a `/forgot-password` (Foco 1). Tras éxito: toast `Contraseña actualizada. Ya puedes ingresar.` y navega a `/login`.
- Formularios con react-hook-form + zod; errores debajo de cada campo.

- [ ] **Paso 1: tests** — `authErrors.test.ts`: cada código de la lista → su mensaje; `new Error('x')` → mensaje genérico; `{ code: 'auth/popup-closed-by-user' }` → `''`. `postAuth.test.ts`: `[]` → `/onboarding`; `[{ onboardingStep: 2 }]` → `/onboarding`; `[{ onboardingStep: null }]` → `/dashboard`; `[{}]` → `/dashboard`; `[{ onboardingStep: 4 }]` → `/dashboard`.
- [ ] **Paso 2:** `npm test` → FALLAN; implementar; `npm test` → PASAN.
- [ ] **Paso 3:** implementar layout y páginas; login exitoso y Google navegan con `postAuthPath`.
- [ ] **Paso 4:** `npm run build` → OK; commit `feat: ingresar y recuperar contraseña con el diseño nuevo`.

### Task 4: Crear cuenta

**Archivos:**
- Crear: `src/pages/account/RegisterPage.tsx`; `src/lib/password.ts` + `src/lib/password.test.ts`
- Modificar: `src/router.tsx`
- Eliminar: `src/pages/auth/register.tsx` (y `src/pages/auth/` si queda vacío)
- Referencia: `docs/design/Register.dc.html`

**Interfaces:**
- Consume: `useRegister` (`hooks/useAuth.ts`), `authWithGoogle`, `authErrorMessage`, `postAuthPath`, `useRedirectIfAuthenticated`, `PLANS`/`TRIAL_DAYS`.
- Produce: `passwordChecks(pw: string): { minLength: boolean; upperAndNumber: boolean; symbol: boolean }` y `passwordStrength(pw: string): 'weak' | 'ok' | 'strong'` — `weak` si falla `minLength` o `upperAndNumber`; `ok` si cumple ambos sin símbolo; `strong` si además tiene símbolo. Etiquetas en UI: weak `Contraseña débil`, ok `Contraseña aceptable`, strong `Contraseña fuerte`.
- Validación: nombre requerido; correo válido; contraseña no `weak`; checkbox de términos obligatorio (`Debes aceptar los términos para continuar.`).
- Tras crear la cuenta (o Google) → `/onboarding`. La verificación de correo **no bloquea** (spec). Se conserva la llamada a `sendConversionEvent` si `useRegister` la hacía.

- [ ] **Paso 1: test** `password.test.ts`: `''` → weak; `abcdefgh` → weak; `Abcdefg1` → ok; `Abcdefg1!` → strong; `Ab1!` → weak (corta).
- [ ] **Paso 2:** `npm test` → FALLA; implementar; `npm test` → PASA.
- [ ] **Paso 3:** implementar la página fiel al artboard (columna de beneficios a la izquierda en escritorio; arriba y compacta en móvil).
- [ ] **Paso 4:** `npm run build` → OK; commit `feat: crear cuenta con el diseño nuevo`.

### Task 5: Verificar correo

**Archivos:**
- Crear: `src/pages/account/VerifyEmailPage.tsx`
- Modificar: `src/router.tsx` (`/verify`)
- Eliminar: `src/pages/verify-email/**`; quitar `useVerifyEmail` de `hooks/useAuth.ts` si queda sin uso
- Referencia: `docs/design/VerifyEmail.dc.html` (tres estados)

**Interfaces:**
- Consume: `applyActionCode`, `reload` de `firebase/auth`; `auth` de `utils/firebase`; `useSendVerificationEmail`; `authErrorMessage`.
- Comportamiento:
  - Con `?mode=verifyEmail&oobCode=X`: `applyActionCode(auth, X)` → estado **Verificado** (botón `Empezar` → `postAuthPath`); si lanza `auth/expired-action-code` o `auth/invalid-action-code` → estado **Expirado** (`Enviar enlace nuevo` si hay sesión, y `Ir a ingresar`).
  - Sin código y con sesión: `reload(auth.currentUser)`; si `emailVerified` → Verificado; si no → **Pendiente**, con el correo del usuario, `Reenviar correo` (toast `Te enviamos otro enlace.`) y `Cambiar correo` (cierra sesión y va a `/register`). Agregar un enlace secundario `Seguir sin verificar` → `postAuthPath` (la verificación no bloquea).
  - Sin código y sin sesión → `/login`.

- [ ] **Paso 1:** implementar; `npm run build` → OK.
- [ ] **Paso 2:** commit `feat: verificación de correo con el diseño nuevo`.

### Task 6: Onboarding · estructura y paso 1

**Archivos:**
- Crear: `src/pages/onboarding/OnboardingPage.tsx` (estructura, barra de pasos, "Guardar y salir"), `src/pages/onboarding/StepBusiness.tsx`, `src/pages/onboarding/MenuPreview.tsx`, `src/pages/onboarding/useOnboarding.ts`; `src/lib/slug.ts` + `src/lib/slug.test.ts`
- Modificar: `src/router.tsx` (`/onboarding`, con sesión obligatoria → si no, `/login`), `src/types/Establishment.ts` (campos opcionales `type` y `onboardingStep`), `src/services/establishments.ts` (`isSlugAvailable`; aceptar `type` y `onboardingStep` en create/update)
- Referencia: `docs/design/Onboarding1.dc.html`

**Interfaces:**
- Produce:
  - `slugify(name: string): string` — minúsculas, sin acentos (NFD), `ñ` → `n`, todo lo que no sea `[a-z0-9]` → `-`, guiones colapsados y recortados, máx. 40 caracteres.
  - `isValidSlug(s: string): boolean` — `/^[a-z0-9]+(-[a-z0-9]+)*$/`, entre 3 y 40.
  - `isSlugAvailable(slug: string): Promise<boolean>` — query `establishments` con `where('domain', '==', slug)`, `limit(1)`, disponible si vacío.
  - `type EstablishmentType = 'restaurant' | 'cafe' | 'bar' | 'hotel' | 'other'` (etiquetas: Restaurante, Cafetería, Bar, Hotel, Otro).
  - `useOnboarding(): { establishment: EstablishmentProps | null; step: 1|2|3|4; loading: boolean; saveStep(n: 1|2|3|4, data: Partial<CreateEstablishmentParams>): Promise<void> }` — carga el primer establecimiento del usuario; `step = establishment?.onboardingStep ?? 1`. En el paso 1, si no existe, llama `createEstablishment` con los datos y `onboardingStep: 2`; si existe, `updateEstablishment` (Foco 3: nunca crea un segundo).
  - `<MenuPreview name; type?; phone?; slug; logoUrl?; bannerUrl?; color?; category?; product?: { name; price; description?; photoUrl? } />` — teléfono simulado como en los artboards; se reutiliza en los pasos 2–4.
- Paso 1: el campo de enlace se autocompleta con `slugify(nombre)` hasta que el usuario lo edite; verificación de disponibilidad con debounce de 400 ms, que muestra `Disponible` / `Ya está en uso, prueba otro` / `Solo minúsculas, números y guiones.` (Foco 2). `Continuar` deshabilitado hasta que el nombre exista y el slug sea válido y esté disponible. Al crear se pasan los campos que `createEstablishment` ya espera, con defaults vacíos.
- "Guardar y salir" guarda el paso actual (si ya hay establecimiento) y navega a `/dashboard`.

- [ ] **Paso 1: test** `slug.test.ts`: `slugify('La Roca Restaurant')` → `la-roca-restaurant`; `slugify('  Café Ñoño!! ')` → `cafe-nono`; `slugify('a'.repeat(60)).length` → 40; `isValidSlug('la-roca')` → true; `isValidSlug('La-Roca')` → false; `isValidSlug('la--roca')` → false; `isValidSlug('ab')` → false.
- [ ] **Paso 2:** `npm test` → FALLA; implementar; `npm test` → PASA.
- [ ] **Paso 3:** implementar estructura, paso 1 y vista previa; `npm run build` → OK.
- [ ] **Paso 4:** commit `feat: onboarding, paso 1`.

### Task 7: Onboarding · pasos 2 y 3

**Archivos:**
- Crear: `src/pages/onboarding/StepBrand.tsx`, `src/pages/onboarding/StepFirstDish.tsx`; `src/lib/color.ts` + `src/lib/color.test.ts`
- Referencia: `docs/design/Onboarding2.dc.html`, `docs/design/Onboarding3.dc.html`

**Interfaces:**
- Consume: `useOnboarding`, `MenuPreview`, `updateEstablishment` (acepta `logo`/`banner` File), `createCategory` (`services/categories.ts`), `createProduct` (`services/products.ts`).
- Produce:
  - `contrastRatio(hexA: string, hexB: string): number` (WCAG 2.1).
  - `readableOn(hex: string, bg = '#FFFFFF'): { ok: boolean; text: string }` — `ok` si la razón ≥ 4.5; si no, `text` es el mismo tono oscurecido (bajando la luminosidad en HSL de a 2 %) hasta llegar a 4.5. Devuelve hex en mayúsculas.
- Paso 2: logo (cuadrado) y portada (horizontal) con vista previa local inmediata; color con selector + campo HEX. Si `!readableOn(color).ok`, mostrar el aviso del artboard con el hex oscurecido y un switch `Usar mi color exacto igual`. Se guarda `mainHexColor` (el color elegido; el oscurecido se calcula al mostrar). `Omitir por ahora` avanza sin guardar marca. Al continuar: `saveStep(3, { logo, banner, mainHexColor })`.
- Paso 3: categoría (texto + chips de sugerencia: Entradas, Platos fuertes, Bebidas, Postres); plato: foto, nombre, precio, descripción opcional. Al guardar: `createCategory` y luego `createProduct` con los campos bilingües (`es_name`, `en_name` = mismo texto; `es_description`, `en_description`), `establishmentId`, `categoryId` y `order: 0`; luego `saveStep(4, {})`. Revisar las firmas reales de ambos servicios antes de llamarlos. `Lo hago después` → `saveStep(4, {})`.

- [ ] **Paso 1: test** `color.test.ts`: `contrastRatio('#000000', '#FFFFFF')` ≈ 21 (±0.01); `readableOn('#2A1410').ok` → true; `readableOn('#F5A623')` → `ok: false`, `contrastRatio(text, '#FFFFFF') >= 4.5` y `text !== '#F5A623'`; `readableOn('#c2381f').ok` → true.
- [ ] **Paso 2:** `npm test` → FALLA; implementar; `npm test` → PASA.
- [ ] **Paso 3:** implementar ambos pasos; `npm run build` → OK.
- [ ] **Paso 4:** commit `feat: onboarding, pasos 2 y 3`.

### Task 8: Onboarding · paso 4 y cierre de la fase

**Archivos:**
- Crear: `src/pages/onboarding/StepDone.tsx`; `src/lib/qr.ts`
- Modificar: `package.json` (`qrcode`, `@types/qrcode`)
- Referencia: `docs/design/Onboarding4.dc.html`

**Interfaces:**
- Consume: `useOnboarding`, `MenuPreview`, `establishment.billing?.trialEndsAt` (Timestamp de Firestore).
- Produce: `menuUrl(slug: string): string` → `https://goqr.com.do/m/${slug}`; `qrSrc(slug: string): string` → `${menuUrl(slug)}?src=qr`; `downloadQrPng(slug: string, filename: string): Promise<void>` con `qrcode` (`toDataURL`, 1024 px, margen 2, colores cacao sobre blanco).
- Paso 4: al entrar, `saveStep(4, { onboardingStep: null })` deja el onboarding terminado. Fecha de fin de prueba formateada `d 'de' MMMM` en español (con `Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long' })`); si `billing` aún no existe (el trigger tarda), muestra `en 30 días`. Botones: `Descargar PNG`; `Compartir por WhatsApp` (`https://wa.me/?text=` + texto codificado con el enlace); `Copiar` (toast `Enlace copiado`); `Ver planes` → `/dashboard/invoices` (el plan nuevo llega en la fase 4); `Ir a mi panel y completar el menú` → `/dashboard`. **Diferidos a la fase 3** (la pantalla de QR del panel): `Descargar PDF` e `Imprimir plantilla de mesa`, que no se muestran en esta fase.
- Cierre: `npm run lint` sin errores nuevos en archivos de esta fase; `grep -rn "antd\|sweetalert2" src/pages/landing src/pages/account src/pages/onboarding src/layouts src/components/brand` → vacío.

- [ ] **Paso 1: test** `src/lib/qr.test.ts`: `menuUrl('la-roca')` → `https://goqr.com.do/m/la-roca`; `qrSrc('la-roca')` → `https://goqr.com.do/m/la-roca?src=qr`.
- [ ] **Paso 2:** `npm test` → FALLA; implementar; `npm test` → PASA.
- [ ] **Paso 3:** implementar el paso 4; `npm run build` → OK; comprobaciones de cierre.
- [ ] **Paso 4:** commit `feat: onboarding, paso 4`.
