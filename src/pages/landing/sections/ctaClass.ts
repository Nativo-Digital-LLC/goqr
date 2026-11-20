import { cn } from "@/lib/utils";

const base =
	"inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export const ctaClass = {
	primary: cn(base, "bg-brand text-white hover:bg-brand-hover"),
	outline: cn(base, "border border-primary text-primary hover:bg-primary/5"),
	platano: cn(base, "bg-platano text-primary hover:bg-platano/90"),
	// Tarjeta destacada de precios: tomate en desktop, plátano en móvil (la tarjeta se vuelve tomate).
	// Cada fondo de hover va en su breakpoint para no mezclar texto cacao con tomate oscuro (2.5:1).
	featured: cn(
		base,
		"bg-brand text-white md:hover:bg-brand-hover max-md:bg-platano max-md:text-primary max-md:hover:bg-platano/90"
	),
};
