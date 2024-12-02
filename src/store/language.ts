import { create } from 'zustand';

import en from '../locale/en';
import es from '../locale/es';
import { DictionaryProps, Lang } from '../types/Dictionary';

interface LanguageStoreProps {
	lang: Lang;
	setLang: (lang: Lang) => void;
	dictionary: DictionaryProps;
}

export const useLanguageStore = create<LanguageStoreProps>((set) => ({
	lang: 'es',
	setLang: (lang: Lang) => {
		set((state) => ({
			...state,
			lang,
			dictionary: lang === 'en' ? en : es
		}));

		localStorage.setItem('lang', lang);
	},
	dictionary: es
}));

(async () => {
	const lang = localStorage.getItem('lang') as Lang | null;
	if (lang) {
		const { setLang } = useLanguageStore.getState();
		setLang(lang);
		return;
	}

	const navLang = navigator.language || navigator.languages[0];
	if (navLang && navLang.includes('es')) {
		const { setLang } = useLanguageStore.getState();
		setLang('es');
		return;
	}

	if (navLang && navLang.includes('en')) {
		const { setLang } = useLanguageStore.getState();
		setLang('en');
		return;
	}
})();
