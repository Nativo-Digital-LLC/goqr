import { Home, UtensilsCrossed, Store, QrCode, BarChart3, CreditCard, type LucideIcon } from "lucide-react";

export const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
	{ to: "/dashboard", label: "Resumen", icon: Home, end: true },
	{ to: "/dashboard/menu", label: "Menú", icon: UtensilsCrossed },
	{ to: "/dashboard/establishment", label: "Establecimiento", icon: Store },
	{ to: "/dashboard/qr", label: "Código QR", icon: QrCode },
	{ to: "/dashboard/stats", label: "Estadísticas", icon: BarChart3 },
	{ to: "/dashboard/billing", label: "Plan y pagos", icon: CreditCard },
];
