export interface DictionaryProps {
	menu: {
		establishment: {
			leaveReview: string;
		};
		search: string;
		product: {
			price: {
				free: string;
			}
		},
		foodAllergyAndRiskDisclaimer: string;
	};
}

export type Lang = 'es' | 'en';
