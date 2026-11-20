# Fase 6 — Imágenes: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que toda imagen de menú quede comprimida en WebP sin pérdida visible de calidad: automáticamente después de cada subida, y de una vez para las imágenes existentes, borrando originales y archivos sin uso.

**Architecture:** El cliente sigue subiendo a `uploads/{uid}/` y guardando esa URL en el documento (se ve al instante). Un trigger de Firestore sobre los documentos con imagen detecta campos que apuntan a `uploads/`, comprime con `sharp`, guarda en `optimized/`, reemplaza la URL solo si el campo no cambió mientras tanto y borra el original. Un script local reutiliza la misma compresión para las imágenes existentes (muestra visual, respaldo, aplicar, huérfanos).

**Tech Stack:** Firebase Functions v2 (Node 22, TypeScript), firebase-admin Storage/Firestore, `sharp`, vitest, `tsx` para el script.

**Spec:** `Web/docs/superpowers/specs/2026-11-19-goqr-relaunch-design.md` (sección "Imágenes", fase 6), con estos cambios aprobados por el usuario el 2026-11-19: trigger sobre el documento (no `onObjectFinalized` con metadata), máximo 2000 px y WebP q82 (no 1600 px/q80), sin miniaturas, script de backfill con muestra visual y respaldo antes de borrar.

## Global Constraints

- Trabajo en el worktree `/Users/ldss/Desktop/Proyectos/Nativo_Digital/GoQR/Functions-fase-6` (rama `fase-6` desde `main`). **Nunca** tocar el checkout `/Users/ldss/Desktop/Proyectos/Nativo_Digital/GoQR/Functions` (tiene WIP del usuario).
- Campos con imagen: `products/{id}.photoUrl`; `establishments/{id}.logoUrl` y `.bannerUrl`; `establishments/{e}/categories/{c}/subcategories/{s}.photoUrl`.
- Bucket: `goqr-914b1.firebasestorage.app`. URLs de descarga: `https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path codificado>?alt=media&token=<uuid>`.
- Compresión: `rotate()` (EXIF), `resize` dentro de 2000×2000 sin agrandar, `webp({ quality: 82, effort: 5 })`, conserva transparencia, quita metadatos. Si el WebP no pesa menos que el original, se guarda el original tal cual. GIF y tipos que no son imagen se copian sin tocar.
- Destino determinista y único por documento: `optimized/<docId>-<field>-<sha1(srcPath) primeros 10 hex>.webp` (o la extensión original si no se comprimió).
- Nunca se lista ni se borra nada bajo `proofs/`.
- Comparar referencias por **ruta del objeto**, no por URL completa (los tokens difieren).
- Copias y comentarios en español (RD) con tildes; indentación con tabs.
- Commits con `git add` de rutas exactas, terminados en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Nunca push.
- Solo se prueba lógica pura y la compresión (sharp en proceso); el I/O de triggers y del script no.

## Review Focus

1. El dueño cambia la foto otra vez mientras la primera se comprime → la segunda no se pisa (Task 2: actualización condicional en transacción).
2. El trigger se reintenta o corre dos veces → un solo archivo en `optimized/` (Task 1: destino determinista).
3. Foto de celular con orientación EXIF → no queda de lado (Task 1).
4. Logo PNG transparente → sigue transparente (Task 1).
5. Escaneo de huérfanos → jamás incluye `proofs/` ni un archivo referenciado por cualquier documento, incluidos productos con `deletedAt` (Task 3).

---

### Task 1: Política y compresión de imágenes

**Files:**
- Modify: `functions/package.json`, `functions/package-lock.json` (añadir `sharp`)
- Create: `functions/src/modules/imagePolicy.ts`
- Test: `functions/src/modules/imagePolicy.test.ts`

**Interfaces:**
- Produces:
  - `BUCKET = 'goqr-914b1.firebasestorage.app'`
  - `IMAGE_FIELDS: Record<'products' | 'establishments' | 'subcategories', string[]>`
  - `storagePath(url: unknown, bucket?: string): string | null` — ruta del objeto si la URL es de descarga de ese bucket; si no, `null`.
  - `downloadUrl(path: string, token: string, bucket?: string): string`
  - `optimizedPath(docId: string, field: string, srcPath: string, ext: string): string`
  - `pendingFields(after: Record<string, unknown> | undefined, fields: string[]): { field: string; url: string; path: string }[]` — campos cuya ruta empieza por `uploads/`.
  - `staleFiles(before, after, fields): string[]` — rutas `optimized/` que estaban en `before[field]` y ya no están en `after[field]` (o el documento se borró).
  - `compressImage(input: Buffer, contentType: string): Promise<{ buffer: Buffer; contentType: string; ext: string; compressed: boolean }>`

- [ ] **Step 1:** `npm install sharp` en `functions/`.
- [ ] **Step 2: Tests que fallan** en `imagePolicy.test.ts` (fixtures generadas con `sharp` en el test):
  - `storagePath` de una URL real del bucket → `products/a b.jpg` (decodifica `%2F` y espacios); otro bucket, Appwrite, Drive, `''`, `null` → `null`.
  - `downloadUrl` ↔ `storagePath` ida y vuelta.
  - `optimizedPath('p1','photoUrl','uploads/u/x.jpg','webp')` coincide con `/^optimized\/p1-photoUrl-[0-9a-f]{10}\.webp$/` y es igual en dos llamadas.
  - `pendingFields` devuelve solo campos en `uploads/`; ignora `optimized/`, `products/`, externos.
  - `staleFiles`: cambio de `optimized/a.webp` a otra URL → `['optimized/a.webp']`; sin cambio → `[]`; antes en `products/x.jpg` → `[]`; documento borrado (`after` undefined) → rutas `optimized/` de `before`.
  - `compressImage`: JPEG 3000×2000 → WebP, ancho 2000, `compressed: true`, más liviano; JPEG con EXIF orientación 6 (600×400) → salida 400×600; PNG con alfa → WebP con `hasAlpha`; PNG diminuto donde el WebP no ahorra → original, `compressed: false`; GIF y `text/html` → original sin tocar.
- [ ] **Step 3:** `npx vitest run src/modules/imagePolicy.test.ts` → falla.
- [ ] **Step 4:** Implementar `imagePolicy.ts`.
- [ ] **Step 5:** `npm run build && npx vitest run` → pasa.
- [ ] **Step 6:** Commit (`functions/package.json functions/package-lock.json functions/src/modules/imagePolicy.ts functions/src/modules/imagePolicy.test.ts`).

### Task 2: Compresión automática después de subir

**Files:**
- Create: `functions/src/modules/images.ts` (reemplaza el archivo comentado de Appwrite)
- Modify: `functions/src/connection.ts` (exportar `storage = getStorage(app)`), `functions/src/index.ts`

**Interfaces:**
- Consumes: todo lo de Task 1.
- Produces:
  - `optimizeDocImages(ref: DocumentReference, docId: string, before, after, fields: string[]): Promise<void>` (lo usa también Task 3).
  - Triggers exportados: `onProductImage` (`products/{id}`), `onEstablishmentImage` (`establishments/{id}`), `onSubcategoryImage` (`establishments/{e}/categories/{c}/subcategories/{s}`), todos `onDocumentWritten` con `{ retry: true, memory: '1GiB', timeoutSeconds: 300 }`.

`optimizeDocImages`, por cada `pendingFields(after)`:
1. Descarga `bucket.file(path)`; si no existe, sigue con el siguiente campo.
2. `compressImage`, guarda en `optimizedPath(...)` con `contentType` y metadata `firebaseStorageDownloadTokens: randomUUID()`, `cacheControl: 'public, max-age=31536000'`.
3. Transacción: si `campo actual === url original`, lo actualiza a `downloadUrl(dest, token)`; si no, borra el `dest` recién creado.
4. Si se actualizó, borra el original de `uploads/` (ignorar 404).
Después borra cada `staleFiles(before, after)` (ignorar 404). Los errores de un campo se registran y se lanzan al final (para el reintento).

- [ ] **Step 1:** Implementar `images.ts`, `connection.ts`, exportar en `index.ts`.
- [ ] **Step 2:** `npm run build && npx vitest run` → pasa.
- [ ] **Step 3:** Commit (`functions/src/modules/images.ts functions/src/connection.ts functions/src/index.ts`).

### Task 3: Script para las imágenes existentes

**Files:**
- Create: `functions/scripts/images.ts`, `functions/src/modules/imageInventory.ts`
- Test: `functions/src/modules/imageInventory.test.ts`
- Modify: `functions/package.json` (script `"images": "tsx scripts/images.ts"`; `tsx` como devDependency)

**Interfaces:**
- Consumes: Task 1 y `optimizeDocImages` no (el backfill tiene su propia fuente: bucket o HTTP).
- Produces (puro, en `imageInventory.ts`):
  - `type ImageRef = { docPath: string; docId: string; field: string; url: string }`
  - `needsBackfill(ref: ImageRef): boolean` — `true` si la URL es del bucket y no está en `optimized/`, o si es de `appwrite.nd.com.do` / `appwrite.goqr.com.do`.
  - `findOrphans(objects: string[], refs: ImageRef[]): string[]` — objetos no referenciados por ruta; excluye siempre `proofs/`.

Uso (se ejecuta con `GOOGLE_APPLICATION_CREDENTIALS=<Migration/firebase-service-account.json>`):
- `npm run images -- sample <dir> [n=20]` — elige n imágenes referenciadas variadas (las más pesadas, PNG, retratos), escribe original y comprimida en `<dir>` y un `index.html` lado a lado con dimensiones y pesos. No escribe en el bucket ni en Firestore.
- `npm run images -- backup <dir>` — descarga todos los objetos del bucket a `<dir>` conservando rutas.
- `npm run images -- apply [--limit N]` — para cada `ImageRef` con `needsBackfill`: obtiene bytes (bucket o `fetch`), `compressImage`, sube a `optimizedPath`, actualiza el campo solo si sigue igual (transacción). Concurrencia 4. No borra nada. Escribe `apply-report.json` (antes/después en bytes, errores).
- `npm run images -- orphans [--delete --yes]` — lista los huérfanos con tamaño total; solo borra con ambos flags.

Recolección de referencias: todos los establecimientos, sus categorías y subcategorías, y todos los productos (incluye `deletedAt`), tomando solo los campos de `IMAGE_FIELDS`.

- [ ] **Step 1: Tests que fallan** en `imageInventory.test.ts`: `needsBackfill` (bucket legacy → true; `optimized/` → false; Appwrite → true; Drive → false); `findOrphans` (referenciado con otro token → no huérfano; `proofs/x.pdf` sin referencia → no aparece; sin referencia → aparece).
- [ ] **Step 2:** `npx vitest run src/modules/imageInventory.test.ts` → falla.
- [ ] **Step 3:** Implementar `imageInventory.ts` y `scripts/images.ts`.
- [ ] **Step 4:** `npm run build && npx vitest run` → pasa; `npm run images -- orphans` con credenciales lista ~44 archivos (solo lectura).
- [ ] **Step 5:** Commit (`functions/package.json functions/package-lock.json functions/scripts/images.ts functions/src/modules/imageInventory.ts functions/src/modules/imageInventory.test.ts`).

## Después del plan (controlador, con el usuario)

1. `sample` → el usuario aprueba la calidad.
2. Push de `fase-6` a `main` (con aprobación) → se despliegan los triggers.
3. `backup` → `apply` → revisar reporte → `orphans` → el usuario confirma la lista → `orphans --delete --yes`.
