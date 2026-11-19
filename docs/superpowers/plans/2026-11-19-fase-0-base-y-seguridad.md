# Fase 0 · Base y seguridad: plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** cerrar los huecos de seguridad actuales y dejar la base técnica (rama, Tailwind v4, shadcn, tokens) sobre la que se construyen las fases 1–8, sin romper los menús en producción.

**Arquitectura:** dos repos (`Web/`, `Functions/functions/`), cada uno en su rama `relaunch`. La seguridad se mueve al servidor: reglas Firestore/Storage, triggers que escriben `billing`/`isActive` y la indexación en Meilisearch, y verificación de Appwrite en el propio callable. La UI actual (antd) sigue funcionando; shadcn se instala al lado.

**Stack:** Firebase (Firestore, Storage, Auth, Functions v2 + `firebase-functions/v1` para el trigger de Auth), Vitest, `@firebase/rules-unit-testing` con emuladores (Java 21 y firebase-tools 13.35 ya instalados), Tailwind v4, shadcn/ui.

**Spec:** `Web/docs/superpowers/specs/2026-11-19-goqr-relaunch-design.md`

## Restricciones globales

- Tabs en el código Web; copia de cara al usuario en español (RD) con acentos.
- Conservar el login dual Appwrite → Firebase (`migrated-users/{email-minúsculas}`).
- Soft-delete con `deletedAt`; campos bilingües `es_`/`en_` intactos.
- Hooks con el patrón `useXxx() → [handler, loading, error]`.
- `Functions/functions` tiene cambios sin commitear del usuario (`package.json`, `package-lock.json`, `src/connection.ts`, `src/modules/images.ts`, `src/modules/products.ts`, `src/helpers.ts`, `src/types/`): **nunca** `git checkout`, `stash`, `reset` ni añadirlos a un commit. Hacer commit solo de archivos tocados por este plan con `git add <ruta>`.
- `/m/:slug` y `/qr/:slug` deben seguir funcionando igual al final de la fase.
- Secrets por `defineSecret`: `RESEND_API_KEY`, `MEILI_ADMIN_KEY`.
- Prueba gratis: una por usuario (`users/{uid}.trialUsedAt`). 30 días.

## Foco de revisión

1. **Usuario migrado desde Appwrite con mayúsculas en el correo:** `migrated-users` usa el correo en minúsculas; la regla debe comparar con `request.auth.token.email.lower()` o el login del camino lento falla.
2. **Establecimiento recién creado antes de que corra el trigger:** el menú público no debe romperse si `isActive`/`billing` aún no existen (lo trata como no disponible unos segundos, sin error).
3. **Imágenes viejas en la raíz del bucket:** siguen siendo de lectura pública tras las nuevas reglas de Storage.
4. **Producto sin `es_name` o con `prices` como string** (datos migrados): el trigger de Meilisearch los indexa igual, sin lanzar.
5. **Reintento del trigger de establecimiento** (Functions entrega "al menos una vez"): no debe gastar la prueba dos veces ni pasar el primer establecimiento a `paused`.

---

### Task 1 (Tarea): Ramas y herramientas de prueba

**Archivos:**
- Modificar: `Web/package.json` (scripts `test`, `test:rules`), `Functions/functions/package.json` (script `test`; solo esas líneas y devDeps, sin tocar lo demás que el usuario cambió)
- Crear: `Web/vitest.config.ts`, `Functions/functions/vitest.config.ts`

- [ ] **Paso 1:** en `Web/`: `git switch -c relaunch`. En `Functions/`: `git switch -c relaunch` (los cambios sin commitear viajan con la rama, no se tocan).
- [ ] **Paso 2:** `Web`: `npm i -D vitest @firebase/rules-unit-testing`. Scripts: `"test": "vitest run"`, `"test:rules": "firebase emulators:exec --only firestore,storage --project demo-goqr \"vitest run tests/rules\""`.
- [ ] **Paso 3:** `Functions/functions`: `npm i -D vitest`. Script `"test": "vitest run"`. `tsconfig` excluye `**/*.test.ts` del build.
- [ ] **Paso 4:** `npx vitest run` en ambos. Esperado: "No test files found" (exit 0 con `--passWithNoTests`).
- [ ] **Paso 5:** commit en cada repo: `chore: rama relaunch y vitest`.

### Task 2 (Tarea): `updateUserPassword` verifica Appwrite en el servidor (crítico)

Hoy cualquiera puede llamar `updateUserPassword({ email, newPassword })` sin autenticación y cambiar la contraseña de **cualquier** cuenta: toma de cuentas. El callable debe validar las credenciales contra Appwrite él mismo.

**Archivos:**
- Crear: `Functions/functions/src/modules/appwrite.ts`, `Functions/functions/src/modules/appwrite.test.ts`
- Modificar: `Functions/functions/src/modules/auth.ts` (`updateUserPassword`)

**Interfaces:**
- Produce: `verifyAppwriteCredentials(email: string, password: string, fetchImpl?: typeof fetch): Promise<boolean>`. POST a `https://appwrite.nd.com.do/v1/account/sessions/email` con header `X-Appwrite-Project: 66f768e4001537551adf`; `true` si responde 201, `false` si 401, lanza en otro estado.

- [ ] **Paso 1: test**
```ts
it('acepta credenciales válidas', async () => {
	const f = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
	expect(await verifyAppwriteCredentials('a@b.com', 'x', f)).toBe(true);
	expect(f.mock.calls[0][1].headers['X-Appwrite-Project']).toBe('66f768e4001537551adf');
});
it('rechaza 401', async () => {
	const f = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }));
	expect(await verifyAppwriteCredentials('a@b.com', 'x', f)).toBe(false);
});
it('lanza en 500', async () => {
	const f = vi.fn().mockResolvedValue(new Response('', { status: 500 }));
	await expect(verifyAppwriteCredentials('a@b.com', 'x', f)).rejects.toThrow();
});
```
- [ ] **Paso 2:** `npm test` → FALLA (no existe).
- [ ] **Paso 3:** implementar `verifyAppwriteCredentials`. En `updateUserPassword`: aceptar solo `{ email, newPassword }` (quitar la rama `uid`); si `migrated-users/{email.toLowerCase()}` ya existe → `HttpsError('failed-precondition')`; si `verifyAppwriteCredentials` da `false` → `HttpsError('permission-denied')`; si no, `auth.updateUser` como hoy. El cliente (`Web/src/services/auth.ts` `login`) no cambia.
- [ ] **Paso 4:** `npm test` → PASA; `npm run build` → sin errores.
- [ ] **Paso 5:** commit `fix: updateUserPassword valida credenciales de Appwrite en el servidor`.

### Task 3 (Tarea): Correo de bienvenida por trigger de Auth

**Archivos:**
- Modificar: `Functions/functions/src/modules/auth.ts` (reemplazar callable `sendWelcomeEmail` por `onUserCreated`), `Functions/functions/src/index.ts`
- Modificar: `Web/src/services/auth.ts` (`createAccount`: quitar la llamada a `sendWelcomeEmail`)

**Interfaces:**
- Produce: `onUserCreated` = `functions.auth.user().onCreate` de `firebase-functions/v1`, con `runWith({ secrets: ['RESEND_API_KEY'] })`. Envía la plantilla actual `welcome-email.html` (la plantilla nueva llega en la fase 5).

- [ ] **Paso 1:** implementar; omitir el envío si `user.email` es vacío. Ruta de plantilla igual que hoy (`process.cwd()/src/templates`).
- [ ] **Paso 2:** `index.ts` exporta `updateUserPassword, onUserCreated` (y lo de tareas 4 y 6). `sendWelcomeEmail` deja de exportarse; al desplegar, `firebase deploy` pedirá borrarla: aceptar.
- [ ] **Paso 3:** `npm run build` → OK. En Web, `npm run build` → OK.
- [ ] **Paso 4:** commit en cada repo: `feat: correo de bienvenida por trigger de Auth`.

### Task 4 (Tarea): Trigger de alta de establecimiento (billing inicial)

**Archivos:**
- Crear: `Functions/functions/src/modules/billing.ts`, `Functions/functions/src/modules/billing.test.ts`
- Modificar: `Web/src/services/establishments.ts:58` (quitar `isActive: true`), `Functions/functions/src/index.ts`

**Interfaces:**
- Produce:
  - `type BillingStatus = 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled' | 'legacy'`
  - `type Billing = { status: BillingStatus; plan: 'monthly'|'annual'|'lifetime'|null; method: 'card'|'transfer'|null; trialEndsAt: Date|null; currentPeriodEnd: Date|null; stripeCustomerId: string|null; stripeSubscriptionId: string|null }`
  - `initialBilling(trialAlreadyUsed: boolean, now: Date): { billing: Billing; isActive: boolean }`
  - `TRIAL_DAYS = 30`
  - `onEstablishmentCreated` = `onDocumentCreated('establishments/{id}')`

- [ ] **Paso 1: test**
```ts
const now = new Date('2026-11-19T12:00:00Z');
it('primera vez: prueba de 30 días y activo', () => {
	const r = initialBilling(false, now);
	expect(r.billing.status).toBe('trialing');
	expect(r.billing.trialEndsAt).toEqual(new Date('2026-12-19T12:00:00Z'));
	expect(r.isActive).toBe(true);
});
it('ya usó la prueba: pausado', () => {
	const r = initialBilling(true, now);
	expect(r.billing.status).toBe('paused');
	expect(r.billing.trialEndsAt).toBeNull();
	expect(r.isActive).toBe(false);
});
```
- [ ] **Paso 2:** `npm test` → FALLA.
- [ ] **Paso 3:** implementar `initialBilling`. El trigger corre en una transacción: si el doc ya tiene `billing` → salir (idempotente, Foco 5). Leer `users/{userId}`; `trialAlreadyUsed = !!trialUsedAt && trialEstablishmentId !== id`. Escribir `billing` + `isActive` en el establecimiento y, si inició prueba, `users/{userId}` `{ trialUsedAt: now, trialEstablishmentId: id }` con merge.
- [ ] **Paso 4:** `npm test` → PASA. Web: comprobar que el menú público trata `isActive` ausente como no disponible sin error (Foco 2): `grep -n isActive Web/src/pages/menu` y ajustar si lanza.
- [ ] **Paso 5:** commits: `feat: billing inicial por trigger` (Functions) y `fix: el cliente ya no escribe isActive` (Web).

### Task 5 (Tarea): Reglas de Firestore y Storage con pruebas

**Archivos:**
- Modificar: `Web/firestore.rules`, `Web/firebase.json` (añadir `firestore.rules`, `firestore.indexes.json`, `storage.rules` y `emulators` firestore 8080 / storage 9199)
- Crear: `Web/storage.rules`, `Web/tests/rules/firestore.test.ts`, `Web/tests/rules/storage.test.ts`
- Modificar: `Web/src/utils/helpers.ts:128` `uploadFile` → sube a `uploads/{uid}/{uuid}.{ext}` (uid de `auth.currentUser`, lanza si no hay sesión)

**Interfaces:**
- Produce (para fases siguientes): función de reglas `ownsEstablishment(estId)` = `get(/databases/$(database)/documents/establishments/$(estId)).data.userId == request.auth.uid`; campos de servidor `['billing','isActive','userId']`.

Reglas a escribir:
- `establishments`: lectura pública; `create` si `request.resource.data.userId == request.auth.uid` y no trae `billing` ni `isActive`; `update` si es dueño y `!request.resource.data.diff(resource.data).affectedKeys().hasAny(['billing','isActive','userId'])`; `delete` false.
- `categories`, `subcategories`: lectura pública; escritura si `ownsEstablishment(stablishmentId)`.
- `products`: lectura pública; `create` si `ownsEstablishment(request.resource.data.establishmentId)`; `update` si dueño del `resource.data.establishmentId` y `establishmentId` no cambia; `delete` false.
- `migrated-users/{email}`: lectura pública (el login la consulta antes de autenticarse); `write` si `request.auth.token.email.lower() == email`.
- `users/{uid}`: lectura si `request.auth.uid == uid`; escritura false.
- resto: lectura pública como hoy salvo lo anterior; escritura false.
- Storage: lectura pública en todo excepto `proofs/**`; `uploads/{uid}/{file}` escritura si `request.auth.uid == uid`, `contentType.matches('image/.*')` y `size < 10 * 1024 * 1024`; `proofs/{uid}/{file}` lectura/escritura del dueño o `request.auth.token.admin == true` (imagen o PDF, < 10 MB); raíz y `optimized/**`: escritura false.

- [ ] **Paso 1: tests** (con `initializeTestEnvironment({ projectId: 'demo-goqr' })`, sembrando con `withSecurityRulesDisabled`): 
  - dueño crea producto en su establecimiento → `assertSucceeds`
  - otro usuario crea/edita producto de ese establecimiento → `assertFails`
  - otro usuario escribe categoría/subcategoría ajena → `assertFails`
  - dueño hace `update({ isActive: true })` o `update({ billing: {...} })` → `assertFails`; `update({ name: 'X' })` → `assertSucceeds`
  - crear establecimiento con `isActive` → `assertFails`
  - token `{ email: 'Ana@Correo.com' }` escribe `migrated-users/ana@correo.com` → `assertSucceeds`; escribe `migrated-users/otro@correo.com` → `assertFails` (Foco 1)
  - anónimo lee `products/x` y `establishments/x` → `assertSucceeds`
  - Storage: anónimo lee `foto-vieja.jpg` en raíz → `assertSucceeds` (Foco 3); uid A sube a `uploads/A/x.jpg` imagen → OK, a `uploads/B/x.jpg` → falla, PDF en `uploads/A` → falla, a raíz → falla; anónimo lee `proofs/A/c.pdf` → falla.
- [ ] **Paso 2:** `npm run test:rules` → FALLAN las de propiedad (reglas viejas).
- [ ] **Paso 3:** escribir las reglas y cambiar `uploadFile`.
- [ ] **Paso 4:** `npm run test:rules` → todas PASAN; `npm run build` → OK.
- [ ] **Paso 5:** commit `feat: reglas de Firestore y Storage por propietario`.

### Task 6 (Tarea): Meilisearch se indexa desde el servidor

**Archivos:**
- Crear: `Functions/functions/src/modules/search.ts`, `Functions/functions/src/modules/search.test.ts`
- Modificar: `Functions/functions/src/index.ts`; `Web/src/services/products.ts` (quitar los tres `fetch` a Meilisearch)

**Interfaces:**
- Produce:
  - `toSearchAction(id: string, before: Record<string, unknown> | undefined, after: Record<string, unknown> | undefined): { type: 'upsert'; doc: Record<string, unknown> } | { type: 'delete'; id: string } | { type: 'none' }`
  - `onProductWritten` = `onDocumentWritten('products/{productId}')`, secret `MEILI_ADMIN_KEY`, host en param `MEILI_HOST` (`defineString`).

- [ ] **Paso 1: test**
```ts
it('alta → upsert con id', () => {
	expect(toSearchAction('p1', undefined, { es_name: 'Mofongo', deletedAt: null }))
		.toEqual({ type: 'upsert', doc: { es_name: 'Mofongo', deletedAt: null, id: 'p1' } });
});
it('soft-delete → delete', () => {
	expect(toSearchAction('p1', { deletedAt: null }, { deletedAt: new Date() })).toEqual({ type: 'delete', id: 'p1' });
});
it('borrado duro → delete', () => {
	expect(toSearchAction('p1', { deletedAt: null }, undefined)).toEqual({ type: 'delete', id: 'p1' });
});
it('solo cambia order → none', () => {
	expect(toSearchAction('p1', { order: 1, es_name: 'A' }, { order: 2, es_name: 'A' })).toEqual({ type: 'none' });
});
it('prices como string y sin es_name → upsert sin lanzar', () => {
	expect(toSearchAction('p1', undefined, { prices: '[{"price":5}]', deletedAt: null }).type).toBe('upsert');
});
```
Fechas (`Timestamp`) se convierten a milisegundos antes de enviar.
- [ ] **Paso 2:** `npm test` → FALLA.
- [ ] **Paso 3:** implementar; el trigger hace `POST /indexes/products/documents?primaryKey=id` (upsert) o `DELETE /indexes/products/documents/{id}` con `fetch` nativo. Cambios solo de `order` no reindexan (el orden se lee de Firestore).
- [ ] **Paso 4:** `npm test` → PASA; Web `npm run build` → OK.
- [ ] **Paso 5:** commits: `feat: indexación de productos en Meilisearch desde el servidor` (Functions) y `refactor: el cliente ya no escribe en Meilisearch` (Web).

### Task 7 (Tarea): Tailwind v4, shadcn y tokens de marca

**Archivos:**
- Modificar: `Web/package.json`, `Web/vite.config.ts` (plugin `@tailwindcss/vite`, alias `@` → `src`), `Web/tsconfig.app.json` y `Web/tsconfig.json` (`baseUrl`, `paths` `@/*`), `Web/src/index.css`
- Eliminar: `Web/tailwind.config.js`, `Web/postcss.config.js` (si el upgrade los deja sin uso)
- Crear: `Web/components.json`, `Web/src/lib/utils.ts` (`cn`), `Web/src/components/ui/{button,input,label,card,badge,dialog,sheet,dropdown-menu,select,switch,tabs,tooltip,separator,skeleton,sonner,form}.tsx`, `Web/src/styles/tokens.css`

- [ ] **Paso 1:** `npx @tailwindcss/upgrade` (en rama limpia). Revisar el diff; quitar `@tailwindcss/forms` y `@tailwindcss/container-queries` (v4 trae container queries).
- [ ] **Paso 2:** `npx shadcn@latest init` (estilo new-york, base neutral, CSS variables) y `npx shadcn@latest add` de los componentes listados.
- [ ] **Paso 3:** `npm i @fontsource-variable/bricolage-grotesque @fontsource-variable/dm-sans` e importarlas en `main.tsx`.
- [ ] **Paso 4:** `tokens.css` con los valores del artboard "Sistema de diseño" mapeados a variables shadcn:
  - `--background #FAF7F3`, `--foreground #2A1410`, `--card #FFFFFF`, `--muted #F5EFE9`, `--muted-foreground #6B5A54`, `--border #ECE4DC`, `--input #ECE4DC`
  - `--primary #2A1410`, `--primary-foreground #FFFFFF`, `--ring #2A1410`, `--radius 12px`
  - `--brand #C2381F`, `--brand-hover #A82E18`, `--brand-foreground #FFFFFF`, `--platano #FFC53D`, `--crema #FFF3E6`, `--cacao-2 #6E4A3E`, `--line #EBD3BC`
  - `--destructive #9F1239`; `--success #15803D/#E7F5EC`, `--warning #B45309/#FEF3E2`, `--error #9F1239/#FDECEF`, `--info #1D4ED8/#E8EEFD`; `--powered #766660`
  - `--font-display 'Bricolage Grotesque Variable'`, `--font-sans 'DM Sans Variable'`
  - Todo bajo `@theme inline` para que existan `bg-brand`, `text-muted-foreground`, `font-display`, etc. Altura de botón por defecto `h-11` (44 px).
- [ ] **Paso 5:** `npm run build` → OK. `npm run dev` y revisar en el navegador `/`, `/login`, `/dashboard/menus` y `/m/desayunos-la-roca-restaurant`: la UI vieja (antd) se ve igual que antes. Si el preflight de Tailwind rompe antd, envolver los estilos viejos en `@layer` en vez de tocar componentes.
- [ ] **Paso 6:** commit `chore: Tailwind v4, shadcn y tokens de marca`.

### Task 8 (Tarea): Script de admin y despliegue de la fase

**Archivos:**
- Crear: `Functions/functions/scripts/set-admin.ts` (`tsx scripts/set-admin.ts <email>` → `auth.setCustomUserClaims(uid, { admin: true })`)

- [ ] **Paso 1:** escribir el script.
- [ ] **Paso 2 (necesita al usuario):** `firebase functions:secrets:set MEILI_ADMIN_KEY` y `RESEND_API_KEY`; confirmar `MEILI_HOST`. Rotar la clave pública de Meilisearch a una de solo búsqueda y actualizar `VITE_APP_MEILI_SEARCH_KEY`.
- [ ] **Paso 3 (con aprobación del usuario), en este orden:** (a) `cd Functions && firebase deploy --only functions`; (b) `cd Web && firebase deploy --only firestore:rules,storage`; (c) `cd Web && npm run build && firebase deploy --only hosting`. Las funciones van primero para que, cuando las reglas bloqueen `isActive`, ya exista el trigger.
- [ ] **Paso 4: verificación en producción:** crear una cuenta de prueba → llega el correo de bienvenida, el establecimiento queda `trialing` con `isActive: true`; crear producto → aparece en la búsqueda; `/m/desayunos-la-roca-restaurant` carga igual; llamar `updateUserPassword` con un correo cualquiera y contraseña falsa → `permission-denied`.
