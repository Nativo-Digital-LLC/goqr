# Fase 2 — Menú público nuevo: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer `/m/:establishmentUrl` (móvil y escritorio) con shadcn y el diseño del canvas, sin edición inline, conservando la URL, la búsqueda, el idioma, el aviso de alergias y los estados.

**Architecture:** Página nueva en `src/pages/menu/` que reemplaza `index.tsx` y sus componentes antd. Los datos se cargan una vez (sin `onSnapshot`) con un hook `usePublicMenu(slug)`. Lógica pura (horario abierto/cerrado, precio, textos por idioma, enlaces, color) vive en `src/lib/menu.ts` con pruebas. La navegación sigue usando los query params `categoryId` y `subcategoryId`, así que los enlaces compartidos siguen funcionando. Un solo árbol responsivo: en `lg` aparecen la barra lateral de categorías y la columna de información.

**Tech Stack:** React 18, TypeScript, Tailwind v4, shadcn (`src/components/ui`), lucide-react, react-instantsearch (hooks, UI propia), Firebase Firestore, vitest.

**Spec:** `docs/superpowers/specs/2026-11-19-goqr-relaunch-design.md` (fase 2: "Menú público nuevo (móvil + escritorio), sin edición inline"). Diseño: artboards `MenuMobile`, `MenuMobileProduct`, `MenuMobileSearch`, `MenuMobileStates`, `MenuDesktop`, `MenuDesktopProduct` en `docs/design/`.

## Global Constraints

- Rama `fase-2`. **No se despliega** hasta terminar la fase 3 (el editor del panel); no hacer push a `master`.
- Indentación con tabs. Todo el texto visible en español (RD) con acentos, y su versión en inglés cuando el menú está en inglés.
- La URL `/m/:establishmentUrl` no cambia. Los query params `categoryId` y `subcategoryId` se siguen leyendo y escribiendo con esos nombres.
- Sin controles de edición en el menú público, aunque el dueño tenga sesión.
- No se importa nada de `antd`, `@ant-design/icons`, `sweetalert2` ni `instantsearch.css` en los archivos nuevos del menú.
- Componentes shadcn existentes en `src/components/ui` (Button, Badge, Dialog, Sheet, Skeleton, Input, Separator). Tokens de `src/styles/tokens.css`. Los componentes con borde llevan `border-border`.
- Color del restaurante: si `exactColor === true` se usa `mainHexColor` tal cual; si no, `readableOn(mainHexColor).text` de `src/lib/color.ts` para texto y botones sobre blanco.
- Productos con `status === 'HIDDEN'` o `deletedAt != null` nunca se muestran (tampoco en la búsqueda). `NOT_AVAILABLE` se muestra con "Agotado por hoy" / "Sold out today".
- Si en inglés falta `en_name`/`en_description`, se usa el texto en español.
- Si `enableMultiLanguage` es `false`, el menú se muestra en español y no hay selector, aunque `localStorage.lang` diga `en`.
- GoQR no tiene WhatsApp. Los botones de WhatsApp son del restaurante (`establishment.whatsapp`), y solo aparecen si ese campo existe.
- Umami: el botón de categoría conserva `data-umami-event="Category"`, `data-umami-event-id` y `data-umami-event-name`; abrir el detalle de un plato envía `umami.track('Product', { id, name })` si `window.umami` existe.
- Se conservan dos personalizaciones de clientes: el video de intro de 5 s en rutas que contienen "pandora" (`/pandora-intro.mp4`) y el producto `67466c610004d4e7c5bf` sin precio único visible.
- Hooks nuevos siguen el patrón del repo cuando son de acción (`[handler, loading, error]`); los de carga devuelven un objeto (ver Task 3).
- Pruebas: funciones puras con vitest. No se escriben pruebas de páginas con RTL; la UI se verifica en el navegador.
- Commits terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Horario que cruza la medianoche (`8:00 PM - 2:00 AM`) o texto de horario que no se puede leer: el estado debe decir abierto a la 1 a. m. del día siguiente, y con texto ilegible no se muestra estado (nunca "Cerrado" falso). → pruebas en Task 1.
2. Establecimiento con datos antiguos (sin `schedules`, `socialNetworks`, `addressLink`, `en_name`, logo o banner): la página no se rompe y oculta lo que falta (nada de `href="null"`). → pruebas en Task 1 y revisión en Tasks 4–5.
3. Enlace viejo con `categoryId` de una categoría borrada, o `subcategoryId` de otra categoría: se cae a la primera categoría con `replace`, sin pantalla en blanco ni bucle del botón atrás. → Task 4.
4. Búsqueda cuando Meilisearch falla o devuelve productos ocultos o borrados: se muestra el estado vacío y nunca un plato oculto. → prueba de `isVisibleProduct` en Task 1, uso en Task 6.
5. Menú sin categorías o categoría sin productos: estado vacío amable, no una lista en blanco. → Task 4.

---

### Task 1: Lógica pura del menú

**Files:**
- Create: `src/lib/menu.ts`
- Test: `src/lib/menu.test.ts`

**Interfaces:**
- Consumes: `readableOn(hex, bg?)` de `src/lib/color.ts`; tipos `ProductProps`, `ScheduleProps`, `SocialNetworkProps`, `Lang`.
- Produces (todas exportadas de `src/lib/menu.ts`):
  - `localized(doc: Record<string, unknown>, field: 'name' | 'description', lang: Lang): string` — `en_${field}` si lang es `en` y no está vacío; si no, `es_${field}`; `''` si ninguno.
  - `formatPrice(price: number, lang: Lang): string` — `0` → `"Gratis"`/`"Free"`; si no, `"$" + ` número con separador de miles `,` y sin decimales cuando es entero, dos decimales si no (`1500` → `"$1,500"`, `95.5` → `"$95.50"`).
  - `isVisibleProduct(p: Pick<ProductProps, 'status' | 'deletedAt'>): boolean` — false si `HIDDEN` o `deletedAt` no es null/undefined.
  - `parseDays(days: string): number[]` — `"Lunes, Martes"` → índices 0–6 (Lunes = 0 … Domingo = 6); acepta con o sin acentos y mayúsculas; descarta lo que no reconoce.
  - `parseHours(hours: string): { open: number; close: number } | null` — `"h:mm A - h:mm A"` a minutos desde medianoche; `null` si no se puede leer.
  - `openStatus(schedules: ScheduleProps[] | undefined, now: Date): { open: boolean; until: string } | null` — `until` es la hora de cierre (si abierto) o de la próxima apertura (si cerrado) como `"h:mm A"` tal cual venga en el dato; `null` si no hay horarios legibles. Un rango con `close <= open` cruza la medianoche y cuenta para el día siguiente hasta `close`.
  - `dayLabel(index: number, lang: Lang): string` y `formatDays(days: string, lang: Lang): string` — este último reemplaza a `formatConsecutiveDays` ("Lunes a Viernes" / "Monday to Friday"; lista no consecutiva separada por coma).
  - `menuColor(mainHexColor: string, exactColor?: boolean): string`.
  - `whatsappHref(number: string): string` — `https://wa.me/` + solo dígitos; antepone `1` si quedan 10 dígitos (igual que hoy).
  - `telHref(number: string): string`, `reviewHref(placeId: string): string` (`https://search.google.com/local/writereview?placeid=`), `mapsEmbedSrc(address: string): string` (`https://www.google.com/maps?q=<encoded>&output=embed`).
  - `socialHref(s: SocialNetworkProps): string | null` — mueve aquí la construcción de enlaces de `EstablishmentInfo.tsx` (instagram, facebook, tiktok, x, website); `null` si no hay link.
  - `descriptionLines(text: string): { text: string; bold: boolean }[]` — una entrada por línea; línea que empieza con `*` es negrita y se quitan los `*` del inicio y final.

- [ ] **Step 1: Escribir las pruebas** (`src/lib/menu.test.ts`) con al menos estos casos:
  - `localized({ es_name: 'Pollo', en_name: '' }, 'name', 'en')` → `'Pollo'`; con `en_name: 'Chicken'` → `'Chicken'`.
  - `formatPrice(0,'es')` → `'Gratis'`; `formatPrice(0,'en')` → `'Free'`; `formatPrice(1500,'es')` → `'$1,500'`; `formatPrice(95.5,'es')` → `'$95.50'`.
  - `isVisibleProduct({ status: 'HIDDEN', deletedAt: null })` → false; `{ status: 'NOT_AVAILABLE', deletedAt: null }` → true; `{ status: 'VISIBLE', deletedAt: <cualquier objeto> }` → false.
  - `parseDays('Lunes, Miércoles, domingo')` → `[0, 2, 6]`; `parseDays('Miercoles')` → `[2]`.
  - `parseHours('8:00 AM - 10:00 PM')` → `{ open: 480, close: 1320 }`; `parseHours('todo el día')` → `null`; `parseHours('12:00 AM - 12:30 PM')` → `{ open: 0, close: 750 }`.
  - `openStatus([{ days: 'Lunes, Martes, Miércoles, Jueves, Viernes', hours: '8:00 AM - 10:00 PM' }], <miércoles 21:00>)` → `{ open: true, until: '10:00 PM' }`; a las 23:00 → `{ open: false, until: '8:00 AM' }`.
  - Medianoche: `[{ days: 'Viernes', hours: '8:00 PM - 2:00 AM' }]` el sábado a la 1:00 → `{ open: true, until: '2:00 AM' }`; el sábado a las 3:00 → `{ open: false, ... }`.
  - `openStatus(undefined, now)` → `null`; `openStatus([{ days: 'Lunes', hours: 'cerrado' }], now)` → `null`.
  - `formatDays('Lunes, Martes, Miércoles', 'en')` → `'Monday to Wednesday'`; `formatDays('Lunes, Miércoles', 'es')` → `'Lunes, Miércoles'`.
  - `menuColor('#FFC53D', true)` → `'#FFC53D'`; `menuColor('#FFC53D')` → igual a `readableOn('#FFC53D').text`.
  - `whatsappHref('(809) 555-1234')` → `'https://wa.me/18095551234'`.
  - `socialHref({ platform: 'instagram', link: '' })` → `null`.
  - `descriptionLines('Hola\n*Abierto los lunes*')` → `[{ text: 'Hola', bold: false }, { text: 'Abierto los lunes', bold: true }]`.
  - Usa fechas locales construidas con `new Date(2026, 10, 18, 21, 0)` (miércoles) para no depender de la zona horaria.
- [ ] **Step 2:** `npx vitest run src/lib/menu.test.ts` → falla (módulo no existe).
- [ ] **Step 3:** Implementar `src/lib/menu.ts`.
- [ ] **Step 4:** `npx vitest run src/lib/menu.test.ts` → pasa. `npx tsc -b` sin errores.
- [ ] **Step 5:** Commit `feat(menu): lógica pura de horario, precios, idioma y enlaces del menú público`.

### Task 2: Textos del menú en español e inglés

**Files:**
- Modify: `src/types/Dictionary.ts`, `src/locale/es.ts`, `src/locale/en.ts`
- Create: `src/pages/menu/useMenuLang.ts`

**Interfaces:**
- Produces: `dictionary.menu` ampliado con estas claves (ES / EN):
  - `open` "Abierto" / "Open"; `closesAt` "cierra" / "closes"; `closed` "Cerrado" / "Closed"; `opensAt` "abre" / "opens"
  - `directions` "Cómo llegar" / "Directions"; `call` "Llamar" / "Call"; `whatsapp` "WhatsApp"; `leaveReview` (existente, cambiar a "Déjanos tu reseña en Google" / "Leave us a Google review")
  - `search` "Buscar en el menú" / "Search the menu"; `cancel` "Cancelar" / "Cancel"
  - `resultsFor(n, q)` → "4 resultados para «pollo»" / "4 results for “pollo”" (1 → "1 resultado" / "1 result")
  - `noResultsTitle(q)` "No encontramos «langosta»" / "We couldn't find “langosta”"; `noResultsBody` "Prueba con otra palabra o revisa las categorías del menú." / "Try another word or browse the menu categories."; `seeFullMenu` "Ver todo el menú" / "See the full menu"
  - `product.bestSeller` "Más vendido" / "Best seller"; `product.notAvailable` "Agotado por hoy" / "Sold out today"; `product.price.free` "Gratis" / "Free"
  - `chooseSubcategory(category)` "Elige un tipo de {category en minúscula}" / "Choose a type of {category}"
  - `emptyCategory` "Todavía no hay platos en esta categoría." / "There are no dishes in this category yet."; `emptyMenu` "Este menú todavía no tiene categorías." / "This menu has no categories yet."
  - `allergyTitle` "Antes de pedir…" / "Before you order…"; `foodAllergyAndRiskDisclaimer` (existente); `allergyAccept` "Entendido, ver el menú" / "Got it, see the menu"; `allergyNote` "Solo se muestra en tu primera visita." / "Shown only on your first visit."; `allergyInfo` "Información sobre alergias" / "Allergy information"
  - `unavailableTitle` "El menú no está disponible en este momento" / "The menu isn't available right now"; `unavailableBody` "Pídele el menú a tu mesero o contacta al restaurante. Volverá a estar aquí muy pronto." / "Ask your server for the menu or contact the restaurant. It will be back here very soon."; `writeWhatsapp` "Escribir por WhatsApp" / "Message on WhatsApp"; `callRestaurant` "Llamar al restaurante" / "Call the restaurant"
  - `notFoundTitle` "No encontramos este menú" / "We couldn't find this menu"; `notFoundBody` "Revisa que el enlace o el código QR estén completos. Puede que el restaurante haya cambiado su dirección." / "Check that the link or QR code is complete. The restaurant may have changed its address."; `notFoundCta` "¿Tienes un restaurante? Crea tu menú" / "Own a restaurant? Create your menu"; `goHome` "Ir a goqr.com.do" / "Go to goqr.com.do"
  - `schedule` "Horario" / "Hours"; `today` "Hoy" / "Today"; `map` "Mapa" / "Map"; `contact` "Contacto" / "Contact"; `poweredBy` "Powered by GoQR" en ambos.
- Produces: `useMenuLang(enableMultiLanguage: boolean | undefined): { lang: Lang; dictionary: DictionaryProps; setLang: (l: Lang) => void; canSwitch: boolean }` — si `enableMultiLanguage` no es `true`, devuelve `lang: 'es'` y el diccionario español sin tocar `localStorage`; si es `true`, delega en `useLanguageStore`.

- [ ] **Step 1:** Ampliar `DictionaryProps` y ambos locales con las claves de arriba (las de función como `(n: number, q: string) => string`).
- [ ] **Step 2:** Crear `useMenuLang`.
- [ ] **Step 3:** `npx tsc -b` sin errores (los usos viejos de `dictionary.menu` en `src/pages/menu/components` siguen compilando o se borran en Task 7; si una clave renombrada rompe un archivo viejo, mantener el nombre de la clave).
- [ ] **Step 4:** Commit `feat(menu): textos del menú público en español e inglés`.

### Task 3: Carga de datos del menú

**Files:**
- Create: `src/pages/menu/usePublicMenu.ts`

**Interfaces:**
- Consumes: `db`, `Collection`, tipos `EstablishmentProps`, `CategoryProps`, `SubcategoryProps`, `ProductProps`; `isVisibleProduct` (Task 1).
- Produces:
  ```ts
  type PublicMenu = {
  	establishment: EstablishmentProps;
  	categories: CategoryProps[];          // orden por `order`
  	subcategories: Record<string, SubcategoryProps[]>; // por categoryId, orden por `order`
  	products: ProductProps[];             // visibles, orden por `order`
  };
  function usePublicMenu(slug: string | undefined):
  	{ status: 'loading' } | { status: 'not-found' } | { status: 'error'; retry: () => void } | { status: 'ready'; menu: PublicMenu };
  ```
- Consultas (una sola vez, `getDocs`):
  1. `establishments where domain == slug limit 1`; vacío → `not-found`.
  2. En paralelo: `establishments/{id}/categories where deletedAt == null`; `products where establishmentId == id and deletedAt == null` (solo igualdades: no requiere índice compuesto). Ordenar en cliente por `order`.
  3. Para cada categoría con `enableSubcategories`, `.../subcategories where deletedAt == null`, en paralelo.
- Ignorar respuestas de un `slug` anterior si cambia (bandera `cancelled` en el efecto).

- [ ] **Step 1:** Implementar el hook.
- [ ] **Step 2:** `npx tsc -b` sin errores.
- [ ] **Step 3:** Commit `feat(menu): carga única de establecimiento, categorías y platos para el menú público`.

### Task 4: Página del menú — estructura, estados y navegación (móvil)

**Files:**
- Create: `src/pages/menu/MenuPage.tsx`, `src/pages/menu/components/MenuStates.tsx` (`MenuSkeleton`, `MenuNotFound`, `MenuUnavailable`), `src/pages/menu/components/MenuHero.tsx`, `src/pages/menu/components/CategoryNav.tsx`, `src/pages/menu/components/SubcategoryGrid.tsx`, `src/pages/menu/components/AllergyDialog.tsx`, `src/pages/menu/components/LanguageToggle.tsx`
- Modify: `src/router.tsx` (cambiar `import MenuPage from "./pages/menu"` por `import MenuPage from "./pages/menu/MenuPage"`)

**Interfaces:**
- Consumes: Tasks 1–3. `useShowIntro` existente (solo en rutas con "pandora").
- Produces: `MenuPage` (default export) y un contexto o props con `{ menu, lang, dictionary, color }` que Tasks 5–6 usan. Task 5 añade `ProductList`/`ProductDetail`; Task 6 la búsqueda; Task 8 el layout de escritorio. Deja en `MenuPage` un lugar marcado donde se monta la lista de productos de la categoría o subcategoría elegida.

Comportamiento:
- `loading` → `MenuSkeleton` (banner, nombre, chips y 3 tarjetas con `Skeleton`). `error` → mensaje con botón "Reintentar". `not-found` → `MenuNotFound` (textos de Task 2; enlaces a `/register` y `/`). `isActive === false` → `MenuUnavailable` con botones de WhatsApp y Llamar solo si existen esos campos. Estas pantallas siguen el artboard `MenuMobileStates`.
- `document.title = "<nombre> | GoQR"` mientras la página está montada; al desmontar se restaura el anterior.
- `MenuHero`: banner (o un bloque de color de marca si no hay `bannerUrl`), logo circular si hay `logoUrl`, nombre (`h1`), descripción con `descriptionLines`, estado abierto/cerrado de `openStatus` (oculto si `null`), botones Cómo llegar (`addressLink`), Llamar (`telHref`), WhatsApp (`whatsappHref`), redes (`socialHref`), y "Déjanos tu reseña en Google" si hay `googlePlaceId`. `LanguageToggle` ES/EN en la esquina si `canSwitch`.
- `CategoryNav`: chips con scroll horizontal, fijos arriba al hacer scroll; el chip activo usa el color del restaurante (fondo `menuColor`, texto blanco o primario según contraste con `readableOn`). Atributos Umami de la Global Constraints.
- Navegación: sin `categoryId` válido → `navigate(..., { replace: true })` a la primera categoría. Elegir categoría borra `subcategoryId`. Si la categoría tiene `enableSubcategories` y no hay `subcategoryId` válido de esa categoría → `SubcategoryGrid` (título `chooseSubcategory`, tarjetas con foto y nombre; toda la tarjeta es un botón). Con subcategoría elegida, un botón "← <categoría>" vuelve a la cuadrícula.
- Sin categorías → `emptyMenu`.
- `AllergyDialog` (Dialog shadcn): si `showFoodAllergyAndRiskDisclaimer` y no existe `localStorage['goqr:allergy:<establishmentId>']`, se abre una vez al cargar (después de la intro de Pandora si aplica) y guarda la clave al cerrarse. El enlace "Información sobre alergias" del pie lo vuelve a abrir.
- Pie: "Información sobre alergias" (si el aviso está activo) y "Powered by GoQR" enlazando a `/`.
- Ancho máximo del contenido en móvil 560 px centrado (en `lg` lo cambia Task 8).

- [ ] **Step 1:** Implementar los componentes y la página.
- [ ] **Step 2:** `npx tsc -b && npm run lint` sin errores nuevos.
- [ ] **Step 3:** Verificar en el navegador (dev server) con un slug real y uno inexistente: estados, chips, cuadrícula de subcategorías, enlace viejo con `categoryId` inválido (debe reemplazar la URL sin dejar una entrada extra en el historial).
- [ ] **Step 4:** Commit `feat(menu): nueva página del menú público con estados, encabezado y navegación por categorías`.

### Task 5: Platos — tarjeta y detalle

**Files:**
- Create: `src/pages/menu/components/ProductList.tsx`, `src/pages/menu/components/ProductItem.tsx`, `src/pages/menu/components/ProductDetail.tsx`
- Modify: `src/pages/menu/MenuPage.tsx` (montar `ProductList` en el lugar marcado)

**Interfaces:**
- Consumes: `localized`, `formatPrice`, `menuColor` (Task 1); diccionario (Task 2); `menu.products` (Task 3).
- Produces: `ProductItem({ product, onOpen })` y `ProductDetail({ product, open, onOpenChange })`, que la búsqueda (Task 6) reutiliza.

Comportamiento (artboards `MenuMobile` y `MenuMobileProduct`):
- Lista filtrada por `categoryId` y, si aplica, `subcategoryId`. Vacía → `emptyCategory`.
- `ProductItem`: foto cuadrada a la derecha si hay `photoUrl` (`loading="lazy"`), nombre, descripción recortada a 2 líneas, badge "Más vendido" si `bestSeller`, "Agotado por hoy" si `NOT_AVAILABLE` (tarjeta atenuada pero se puede abrir). Precio: uno → precio en color del restaurante; varios → "Media $X · Entera $Y" con su `label`. El producto `67466c610004d4e7c5bf` no muestra precio único.
- Toda la tarjeta es un `button` que abre `ProductDetail`.
- `ProductDetail`: `Sheet` desde abajo en móvil, `Dialog` centrado en `lg` (usar `matchMedia('(min-width: 1024px)')`). Foto grande, badges, nombre, descripción completa, filas de precios. Al abrir: `window.umami?.track('Product', { id, name: es_name })`.

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** `npx tsc -b && npm run lint`.
- [ ] **Step 3:** Verificar en el navegador un plato con un precio, con varios, agotado, sin foto, y el detalle en móvil y escritorio.
- [ ] **Step 4:** Commit `feat(menu): tarjetas y detalle de platos del menú público`.

### Task 6: Búsqueda

**Files:**
- Create: `src/pages/menu/components/MenuSearch.tsx`
- Modify: `src/pages/menu/MenuPage.tsx`

**Interfaces:**
- Consumes: el cliente por defecto de `src/utils/search.ts` (`import searchClient from "@/utils/search"`); `InstantSearch`, `Configure`, `useSearchBox`, `useHits` de `react-instantsearch`; `isVisibleProduct`, `localized` (Task 1); `ProductItem`, `ProductDetail` (Task 5); `menu.categories`.
- Produces: `MenuSearch` con un campo "Buscar en el menú". En móvil, al enfocarlo pasa a una vista de búsqueda a pantalla completa con "Cancelar" (artboard `MenuMobileSearch`); en `lg` el campo vive en la barra superior y los resultados reemplazan la lista.

Comportamiento:
- `InstantSearch indexName="products"` + `Configure filters={'establishmentId="<id>"'}` y `hitsPerPage={50}`. Consulta con debounce de 250 ms; consulta vacía → no se muestran resultados (vuelve la vista normal).
- Los hits pasan por `isVisibleProduct`. Para cada hit se usa, si existe, el producto de `menu.products` con el mismo `id` (datos frescos de Firestore); si no existe ahí, el hit no se muestra.
- Agrupados por categoría (nombre por idioma, en el orden de `menu.categories`), con el encabezado `resultsFor`.
- Sin resultados (o error de Meili, que ya devuelve hits vacíos) → estado vacío con `noResultsTitle`, `noResultsBody` y botón `seeFullMenu`, que limpia la búsqueda.
- Cancelar/limpiar devuelve el foco al campo y restaura la vista anterior.

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** `npx tsc -b && npm run lint`.
- [ ] **Step 3:** Verificar en el navegador: búsqueda con resultados, sin resultados, y que un plato oculto no aparece.
- [ ] **Step 4:** Commit `feat(menu): búsqueda del menú público con estados de resultado y vacío`.

### Task 7: Retirar el menú viejo

**Files:**
- Delete: `src/pages/menu/index.tsx` (si `MenuPage.tsx` ya no lo usa) y de `src/pages/menu/components/`: `CategoriesMenu.tsx`, `EstablishmentInfo.tsx`, `Header.tsx`, `Loading.tsx`, `NotFoundEstablishment.tsx`, `ProductCard.tsx`, `ProductsList.tsx`, `SubcategoriesList.tsx`, `SubcategoryCard.tsx`, `ToggleLanguageButton.tsx`, `UnavailableEstablishment.tsx`
- Keep: `ModalCategory.tsx`, `ModalProduct.tsx`, `ModalSubcategory.tsx` (la fase 3 decide si los reutiliza), `Footer.tsx` (lo usa `qr.tsx`), `src/pages/menu/qr.tsx`
- Modify: `src/pages/menu/components/index.ts` (exportar solo lo que queda), `src/index.css` (quitar los estilos `.ais-*`), `src/utils/helpers.ts` (quitar `formatConsecutiveDays` y `getSocialUsername` si ya no tienen usos), y borrar los hooks que queden sin uso (`useFDADisclaimer`, y `useListenProducts`/`useGetCategories`/`useGetSubcategories`/`useGetEstablishmentByDomain` solo si `grep` confirma que nadie más los usa).

- [ ] **Step 1:** `grep -rn` cada símbolo antes de borrarlo; borrar solo lo que no tiene usos.
- [ ] **Step 2:** Confirmar que `grep -rn "instantsearch.css\|sweetalert2" src` solo deja usos fuera del menú (o ninguno).
- [ ] **Step 3:** `npx tsc -b && npm run lint && npx vitest run && npm run build` sin errores.
- [ ] **Step 4:** Commit `refactor(menu): retirar el menú público antiguo y su edición inline`.

### Task 8: Escritorio

**Files:**
- Create: `src/pages/menu/components/MenuInfoAside.tsx`
- Modify: `src/pages/menu/MenuPage.tsx`, `src/pages/menu/components/CategoryNav.tsx`, `src/pages/menu/components/MenuHero.tsx`

Comportamiento (artboards `MenuDesktop` y `MenuDesktopProduct`), desde `lg` (1024 px):
- Barra superior con logo y nombre del restaurante, campo de búsqueda (Task 6) y `LanguageToggle`.
- Tres columnas: categorías en una barra lateral fija (lista vertical, misma navegación y atributos Umami que los chips, que se ocultan en `lg`), contenido central (hero compacto, cuadrícula de subcategorías o platos en 2 columnas), y `MenuInfoAside` a la derecha.
- `MenuInfoAside`: Horario (cada día de la semana con sus horas, a partir de `schedules` con `parseDays`/`parseHours`; el día de hoy marcado con `today`; días sin horario muestran "Cerrado"/"Closed"; oculto si no hay horarios legibles), Mapa (`iframe` con `mapsEmbedSrc(address)`, `loading="lazy"`, `title` accesible; oculto sin dirección), botón Cómo llegar, y Contacto (teléfono, WhatsApp, redes).
- Debajo de `lg` nada cambia respecto de Tasks 4–6.

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** `npx tsc -b && npm run lint`.
- [ ] **Step 3:** Verificar en el navegador a 1280 px y 375 px.
- [ ] **Step 4:** Commit `feat(menu): diseño de escritorio del menú público con horario, mapa y contacto`.
