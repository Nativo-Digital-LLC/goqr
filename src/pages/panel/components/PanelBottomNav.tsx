import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, UtensilsCrossed, QrCode, Menu, LifeBuoy, LogOut } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV } from "./PanelNav";

const tabs = [
	{ to: "/dashboard", label: "Inicio", icon: Home, end: true },
	{ to: "/dashboard/menu", label: "Menú", icon: UtensilsCrossed },
	{ to: "/dashboard/qr", label: "QR", icon: QrCode },
];
const more = NAV.filter((n) => ["establishment", "stats", "billing"].some((s) => n.to.endsWith(s)));

const tab = "flex flex-col items-center gap-1 py-2 text-xs";
const row = "flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-[15px] font-medium hover:bg-muted";

export function PanelBottomNav({ onLogout }: { onLogout: () => void }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav
				aria-label="Panel"
				className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-card px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),8px)] lg:hidden"
			>
				{tabs.map(({ to, label, icon: Icon, end }) => (
					<NavLink
						key={to}
						to={to}
						end={end}
						className={({ isActive }) => cn(tab, isActive ? "font-bold text-brand" : "font-semibold text-muted-foreground")}
					>
						<Icon size={22} />
						{label}
					</NavLink>
				))}
				<button type="button" onClick={() => setOpen(true)} className={cn(tab, "cursor-pointer font-semibold text-muted-foreground")}>
					<Menu size={22} />
					Más
				</button>
			</nav>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="bottom" className="rounded-t-2xl pb-8">
					<SheetHeader>
						<SheetTitle>Más</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col gap-1 px-4">
						{more.map(({ to, label, icon: Icon }) => (
							<NavLink key={to} to={to} onClick={() => setOpen(false)} className={row}>
								<Icon size={20} />
								{label}
							</NavLink>
						))}
						<a href="mailto:contacto@goqr.com.do" className={row}>
							<LifeBuoy size={20} />
							Ayuda
						</a>
						<button type="button" onClick={onLogout} className={cn(row, "text-muted-foreground")}>
							<LogOut size={20} />
							Cerrar sesión
						</button>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
