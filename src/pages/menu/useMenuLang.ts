import en from '@/locale/en';
import es from '@/locale/es';
import { useLanguageStore } from '@/store/language';
import { DictionaryProps, Lang } from '@/types/Dictionary';

// Si el restaurante no activó multi-idioma (o aún carga), se fuerza español sin tocar localStorage.
export const useMenuLang = (enableMultiLanguage: boolean | undefined): {
	lang: Lang;
	dictionary: DictionaryProps;
	setLang: (l: Lang) => void;
	canSwitch: boolean;
} => {
	const store = useLanguageStore();
	if (enableMultiLanguage !== true) {
		return { lang: 'es', dictionary: es, setLang: () => {}, canSwitch: false };
	}
	return { lang: store.lang, dictionary: store.lang === 'en' ? en : es, setLang: store.setLang, canSwitch: true };
};
