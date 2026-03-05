export interface SessionProps {
	/**
	 * Identificador de usuario (Firebase UID).
	 */
	userId: string;
	user: {
		uid: string;
		displayName: string | null;
		email: string | null;
		emailVerified: boolean;
		photoURL: string | null;
	};
}

export interface SessionStoreProps {
	session: SessionProps | null;
	setSession: (session: SessionProps | null) => void;
}
