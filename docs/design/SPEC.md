# GoQR — guía para diseñar artboards (C disciplinada sobre base neutra)

Root: /private/tmp/claude-503/-Users-ldss-Desktop-Proyectos-Nativo-Digital-GoQR/fe6475fb-b441-41c8-a16e-0558bb0d4733/scratchpad/canvas/project/
Write ONLY your assigned files there (flat, `Name.dc.html`). Do NOT publish, do NOT touch canvas.json, do NOT render/verify. Follow the .dc.html format rules (support.js head line exact, <x-dc>, <helmet>, script block `class Component extends DCLogic`, quoted attrs, closed tags, flex/grid + gap, inline styles, no emoji, inline stroke SVG icons lucide-style 24 viewBox stroke-width 2, real <button>/<a href>/<input>+<label>, lang="es", no lorem, no invented stats → [N] / [YOUR X] placeholders; images = labelled placeholder blocks with a warm tone bg #EBCDB5 / #D9A98A and a small caption like "Foto del plato").
Copy is Spanish (República Dominicana), with accents. Tú, cercano, directo, sin exagerar.

## Fonts
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&amp;family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&amp;display=swap">
- Display: 'Bricolage Grotesque', system-ui, sans-serif — marketing headlines (800, letter-spacing -0.03em), panel page titles (700). Never body.
- UI/body: 'DM Sans', system-ui, sans-serif.
- Emails: Arial, Helvetica, sans-serif only (no webfonts); headings Arial bold.

## Tokens (map 1:1 to shadcn CSS vars later)
Marketing (landing, auth left panel, social):
- crema #FFF3E6 (ground) · tomate #C2381F (brand, CTA bg with white text 5.4:1) · tomate-hover #A82E18 · platano #FFC53D (accent bg, ALWAYS with cacao text; never as text/border) · cacao #2A1410 (ink) · cacao-2 #6E4A3E (muted text, passes on crema) · line #EBD3BC
Product (auth forms, panel, checkout, admin):
- app-bg #FAF7F3 · surface #FFFFFF · ink #2A1410 · muted #6B5A54 · border #ECE4DC · subtle #F5EFE9 (hover/zebra)
- PRIMARY BUTTON = cacao #2A1410 bg, white text, radius 12px, height 44px, DM Sans 600 15px.
- Secondary button: white bg, 1px #ECE4DC inset, ink text.
- Brand tomate in product ONLY for: logo, active nav item indicator (tomate text #C2381F + #FBE7E2 bg pill), small highlights. Never for destructive.
- Destructive: #9F1239 text/border with trash icon; filled destructive only in confirm dialog.
- Status (always icon + text): success #15803D on #E7F5EC · warning #B45309 on #FEF3E2 · error #9F1239 on #FDECEF · info #1D4ED8 on #E8EEFD.
- Focus ring: 2px #2A1410 offset 2px.
- Radius: inputs/buttons 12px, cards 16px, modals 20px, marketing cards 28-32px, pills 999px.
- Inputs: height 44px, 1px #E0D5CB inset, white, label above 14px 600, helper 13px muted.
- Shadows: product cards none (border only); marketing phone mockups 0 24px 48px rgba(42,20,16,0.18).

## Logo (inline SVG + wordmark)
Mark (size N): <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#C2381F"></circle><rect x="18" y="18" width="18" height="18" rx="5" fill="none" stroke="#FFF3E6" stroke-width="5"></rect><circle cx="43" cy="43" r="6" fill="#FFC53D"></circle></svg>
Wordmark: "goqr" Bricolage 800, letter-spacing -0.04em, cacao on light / crema on dark. No "!".
"Hecho en RD" = campaign sticker (platano bg, cacao text, rotate -3deg, pill) — marketing only, never in product UI.
"Powered by GoQR" in public menus: 12px, #766660 gray, mark in gray monochrome — never tomate.

## Product facts (use exactly)
- Precios (ITBIS incluido): Mensual RD$300/mes · Anual RD$2,520/año (equivale a RD$210/mes, ahorras 30%) · De por vida RD$11,000 pago único.
- Prueba gratis 30 días, sin tarjeta.
- Pagos: tarjeta vía Stripe (Checkout + portal para cambiar tarjeta/cancelar/descargar facturas) o transferencia bancaria (cuentas en RD o EE. UU.) subiendo comprobante; GoQR la aprueba en [≤24 h].
- Contacto: contacto@goqr.com.do · WhatsApp [YOUR WHATSAPP].
- URL del menú: goqr.com.do/m/<slug> ; QR apunta ahí; cambios en tiempo real sin reimprimir.
- Menú: categorías → subcategorías opcionales → productos. Producto: nombre/descr ES+EN, varios precios con etiqueta (ej. "Pequeña RD$250 / Grande RD$400"), foto, estado Visible / Oculto / Agotado, "Más vendido". Idioma ES/EN conmutable. Buscador. Aviso de alergias (opcional). Horarios, dirección, teléfono, WhatsApp, redes, reseñas Google.
- Establecimiento: nombre, slug, descripción, logo, banner, color principal (con verificación de contraste automática), dirección + link mapa, teléfono, WhatsApp, horarios, redes, RNC/razón social si requiere comprobante fiscal, multilenguaje on/off, aviso de alergias on/off.
- Estadísticas (fuente Umami): visitas al menú, escaneos QR, visitantes únicos, categorías y platos más vistos, horas pico, idioma, dispositivos. Usa [N] en lugar de números, y gráficos como barras/líneas dibujadas con divs/SVG simples con alturas plausibles pero SIN etiquetas numéricas inventadas (ejes con [N]).
- Ejemplo de restaurante: "La Roca Restaurant" — "El sabor de la cocina dominicana", categorías Entradas, Sándwiches, Desayunos, Platos fuertes, Bebidas; productos Croquetas de Pollo $7, Pastelitos de Pollo $2, Mangú con los tres golpes [PRECIO], Chicharrón de pollo [PRECIO]. Color del restaurante: #E86B2A (naranja). Second example: "Café Colonial" color #1F4E79.

## Layout sizes
- Desktop PAGE: w 1440, "expand":"fill" style fluid root (max-width container ~1200px, padding-inline 32px; grids `repeat(auto-fit, minmax(min(<min>px,100%),1fr))`), height = real content height (over-tall beats clipped).
- Panel app screens: PAGE w 1440 h 900–1400, shell = left sidebar 248px (flex-wrap row; content `flex: 999 1 560px; min-width:0`), sidebar items: Resumen, Menú, Establecimiento, Código QR, Estadísticas, Plan y pagos, Ayuda; bottom: user + "Cerrar sesión". Top bar in content: page title (Bricolage 700 28px) + establishment switcher ("La Roca Restaurant ▾") + "Ver menú" link.
- Phone screens: fixed 390×844 (taller OK for scrolling content: 390×H). No fake status bar.
- Emails: fixed 600 wide, height to content; outer bg #F5EFE9, card white radius 16.

## Reporting back
Return ONLY a list: `File.dc.html — WxH — fill|fixed — title (Spanish, short)`. Nothing else.
