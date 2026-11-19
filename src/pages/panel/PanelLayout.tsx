import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { Skeleton } from "@/components/ui/skeleton";
import { postAuthPath } from "@/lib/postAuth";
import { getEstablishmentsByUserId } from "@/services/establishments";
import { useSessionStore } from "@/store/session";
import type { EstablishmentProps } from "@/types/Establishment";
import { auth } from "@/utils/firebase";
import { PanelProvider, usePanel } from "./PanelContext";
import { PanelBottomNav } from "./components/PanelBottomNav";
import { PanelSidebar } from "./components/PanelSidebar";
import { VerifyEmailBanner } from "./components/VerifyEmailBanner";

function Frame() {
	const navigate = useNavigate();
	const setSession = useSessionStore((s) => s.setSession);
	const { establishment } = usePanel();

	async function logout() {
		await signOut(auth);
		setSession(null);
		navigate("/login", { replace: true });
	}

	return (
		<div className="flex min-h-screen bg-background text-foreground">
			<PanelSidebar onLogout={logout} />
			<main className="flex min-w-0 flex-1 flex-col gap-6 px-5 pt-6 pb-28 lg:px-10 lg:pt-7 lg:pb-12">
				<VerifyEmailBanner />
				<Outlet key={establishment.id} />
			</main>
			<PanelBottomNav onLogout={logout} />
		</div>
	);
}

export default function PanelLayout() {
	const navigate = useNavigate();
	const [establishments, setEstablishments] = useState<EstablishmentProps[] | null>(null);

	const load = useCallback(async () => {
		await auth.authStateReady();
		const user = auth.currentUser;
		if (!user) {
			navigate("/login", { replace: true });
			return;
		}
		const list = await getEstablishmentsByUserId(user.uid);
		if (postAuthPath(list) === "/onboarding") {
			navigate("/onboarding", { replace: true });
			return;
		}
		setEstablishments(list.filter((e) => !e.deletedAt));
	}, [navigate]);

	useEffect(() => {
		load();
	}, [load]);

	const user = auth.currentUser;
	if (!establishments || !establishments.length || !user) {
		return (
			<div className="flex min-h-screen bg-background">
				<Skeleton className="hidden w-[248px] rounded-none lg:block" />
				<div className="flex flex-1 flex-col gap-6 p-6 lg:px-10">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-40 w-full" />
				</div>
			</div>
		);
	}

	return (
		<PanelProvider
			establishments={establishments}
			reload={load}
			user={{ name: user.displayName || user.email || "", email: user.email || "" }}
		>
			<Frame />
		</PanelProvider>
	);
}
