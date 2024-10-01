import { create } from 'zustand';

import { SessionProps, SessionStoreProps } from '../types/Session';

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
