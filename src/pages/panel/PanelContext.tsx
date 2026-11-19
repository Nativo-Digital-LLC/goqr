import { createContext, useContext, useState, type ReactNode } from "react";

import type { EstablishmentProps } from "@/types/Establishment";

const STORAGE_KEY = "goqr:panel-establishment";

type PanelValue = {
	establishments: EstablishmentProps[];
	establishment: EstablishmentProps;
	select: (id: string) => void;
	/** true si se pudo actualizar. */
	reload: () => Promise<boolean>;
	user: { name: string; email: string };
};

const PanelContext = createContext<PanelValue | null>(null);

export function PanelProvider({
	establishments,
	reload,
	user,
	children,
}: {
	establishments: EstablishmentProps[];
	/** true si se pudo actualizar. */
	reload: () => Promise<boolean>;
	user: PanelValue["user"];
	children: ReactNode;
}) {
	const [selectedId, setSelectedId] = useState(() => localStorage.getItem(STORAGE_KEY));
	// Si el guardado no es del usuario, se usa el primero.
	const establishment = establishments.find((e) => e.id === selectedId) ?? establishments[0];

	const select = (id: string) => {
		localStorage.setItem(STORAGE_KEY, id);
		setSelectedId(id);
	};

	return (
		<PanelContext.Provider value={{ establishments, establishment, select, reload, user }}>
			{children}
		</PanelContext.Provider>
	);
}

export function usePanel(): PanelValue {
	const ctx = useContext(PanelContext);
	if (!ctx) throw new Error("usePanel debe usarse dentro de PanelProvider");
	return ctx;
}
