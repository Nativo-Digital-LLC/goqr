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

// Solo se restaura la preferencia guardada; no se escribe nada si el visitante nunca eligió idioma.
const savedLang = localStorage.getItem('lang') as Lang | null;
if (savedLang === 'en' || savedLang === 'es') useLanguageStore.getState().setLang(savedLang);
