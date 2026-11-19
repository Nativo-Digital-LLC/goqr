import { create } from 'zustand';

import { SessionProps, SessionStoreProps } from '../types/Session';
import { getCurrentSession } from '../services/auth';
import { auth } from '../utils/firebase';

export const useSessionStore = create<SessionStoreProps>((set) => ({
	session: JSON.parse(localStorage.getItem('session') || 'null'),
	setSession: (session: SessionProps | null) => {
		set((state) => ({
			...state,
			session
		}));

		if (session) {
			localStorage.setItem('session', JSON.stringify(session))
		} else {
			localStorage.removeItem('session');
		}
	}
}));

// La sesión de localStorage puede quedar vieja: Firebase manda.
(async () => {
	await auth.authStateReady();
	const { session, setSession } = useSessionStore.getState();
	if (!auth.currentUser) {
		if (session) setSession(null);
		return;
	}
	if (session?.userId === auth.currentUser.uid) {
		return;
	}

	setSession(await getCurrentSession());
})();
