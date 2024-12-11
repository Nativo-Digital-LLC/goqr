import { useEffect } from 'react';
import Swal from 'sweetalert2';

import { SessionProps } from '../types/Session';
import { useLanguageStore } from '../store/language';

export const useFDADisclaimer = (session: SessionProps | null, show?: boolean) => {
	const { dictionary, lang } = useLanguageStore((store) => store);

	useEffect(() => {
		if (!session && show) {
			const foodAllergyAndRiskDisclaimerWasShown = localStorage.getItem('food_allergy_and_risk_disclaimer_was_shown');
			if (!foodAllergyAndRiskDisclaimerWasShown) {
				Swal.fire(
					lang === 'en' ?  'Warning' : 'Advertencia',
					dictionary.menu.foodAllergyAndRiskDisclaimer,
					'warning'
				);
				localStorage.setItem('food_allergy_and_risk_disclaimer_was_shown', 'true');
			}
		}
	}, [session, show, dictionary, lang]);
}
