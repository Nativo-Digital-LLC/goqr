import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";

import { Logo } from "@/components/brand/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { listTransfers } from "@/services/admin";
import { auth } from "@/utils/firebase";

type AdminState = "loading" | "anon" | "admin" | "denied";

// Única verificación de la claim admin.
export function useIsAdmin(): AdminState {
	const [state, setState] = useState<AdminState>("loading");
	useEffect(() => {
		(async () => {
			await auth.authStateReady();
			if (!auth.currentUser) return setState("anon");
			try {
				const { claims } = await auth.currentUser.getIdTokenResult(true);
				setState(claims.admin ? "admin" : "denied");
			} catch {
				setState("denied");
			}
		})();
	}, []);
	return state;
}

export type AdminOutlet = { refreshPending: () => void };

const link = ({ isActive }: { isActive: boolean }) =>
	`flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`;

export default function AdminLayout() {
	const state = useIsAdmin();
	const [pending, setPending] = useState<number | null>(null);

	const refreshPending = useCallback(() => {
		listTransfers("pending").then((t) => setPending(t.length), () => {});
	}, []);
	useEffect(() => {
		if (state === "admin") refreshPending();
	}, [state, refreshPending]);

	if (state === "anon") return <Navigate to="/login" replace />;
	if (state === "loading") {
		return <Skeleton className="m-6 h-40" />;
	}
	if (state === "denied") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
				<p className="text-[15px] font-semibold">No tienes acceso a esta sección.</p>
				<Link to="/dashboard" className="text-[14px] font-semibold text-primary underline">Ir al panel</Link>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
			<aside className="flex flex-col gap-4 border-b border-border p-4 lg:w-[248px] lg:border-r lg:border-b-0 lg:p-6">
				<div className="flex items-center gap-2">
					<Logo size={28} />
					<span className="text-[12px] font-semibold text-muted-foreground">Admin</span>
				</div>
				<nav className="flex gap-1 lg:flex-col">
					<NavLink to="/admin/transfers" className={link}>
						Transferencias
						{!!pending && <span className="rounded-full bg-primary px-2 text-[12px] text-primary-foreground">{pending}</span>}
					</NavLink>
					<NavLink to="/admin/clients" className={link}>Clientes</NavLink>
				</nav>
				<div className="mt-auto flex flex-col gap-1 text-[13px] text-muted-foreground">
					<span className="truncate">{auth.currentUser?.email}</span>
					<Link to="/dashboard" className="font-semibold text-primary underline">Ir al panel</Link>
				</div>
			</aside>
			<main className="flex min-w-0 flex-1 flex-col gap-6 p-5 lg:p-10">
				<Outlet context={{ refreshPending } satisfies AdminOutlet} />
			</main>
		</div>
	);
}
