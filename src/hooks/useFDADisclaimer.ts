import { useEffect } from 'react';
import Swal from 'sweetalert2';

import { SessionProps } from '../types/Session';

export const useFDADisclaimer = (session: SessionProps | null, show?: boolean) => {
	useEffect(() => {
		if (!session && show) {
			const foodAllergyAndRiskDisclaimerWasShown = localStorage.getItem('food_allergy_and_risk_disclaimer_was_shown');
			if (!foodAllergyAndRiskDisclaimerWasShown) {
				Swal.fire(
					'Advertencia',
					'Si usted es alérgico a algún alimento favor de notificar de inmediato al mesero',
					'warning'
				);
				localStorage.setItem('food_allergy_and_risk_disclaimer_was_shown', 'true');
			}
		}
	}, [session, show]);
}
