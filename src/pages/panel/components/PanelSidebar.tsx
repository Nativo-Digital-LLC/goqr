import { NavLink, Link } from "react-router-dom";
import { LifeBuoy, LogOut } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { usePanel } from "../PanelContext";
import { NAV } from "./PanelNav";

const initials = (name: string) =>
	name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

const item = "flex h-11 items-center gap-3 rounded-xl px-3 text-[15px]";

export function PanelSidebar({ onLogout }: { onLogout: () => void }) {
	const { user } = usePanel();

	return (
		<aside className="hidden w-[248px] shrink-0 flex-col gap-7 border-r border-border bg-card px-4 py-5 lg:flex">
			<Link to="/dashboard" className="px-2 py-1" aria-label="GoQR">
				<Logo size={34} />
			</Link>
			<nav aria-label="Panel" className="flex flex-col gap-1">
				{NAV.map(({ to, label, icon: Icon, end }) => (
					<NavLink
						key={to}
						to={to}
						end={end}
						className={({ isActive }) =>
							cn(item, isActive ? "bg-brand/10 font-semibold text-brand" : "font-medium hover:bg-muted")
						}
					>
						<Icon size={20} />
						{label}
					</NavLink>
				))}
				<a href="mailto:contacto@goqr.com.do" className={cn(item, "font-medium hover:bg-muted")}>
					<LifeBuoy size={20} />
					Ayuda
				</a>
			</nav>
			<div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
				<div className="flex items-center gap-2.5 px-2">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
						{initials(user.name)}
					</div>
					<div className="flex min-w-0 flex-col">
						<span className="truncate text-sm font-semibold">{user.name}</span>
						<span className="truncate text-[13px] text-muted-foreground">{user.email}</span>
					</div>
				</div>
				<button type="button" onClick={onLogout} className={cn(item, "cursor-pointer font-medium text-muted-foreground hover:bg-muted")}>
					<LogOut size={20} />
					Cerrar sesión
				</button>
			</div>
		</aside>
	);
}
