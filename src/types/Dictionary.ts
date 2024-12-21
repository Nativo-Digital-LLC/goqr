export interface DictionaryProps {
	menu: {
		establishment: {
			leaveReview: string;
		};
		search: string;
		product: {
			price: {
				free: string;
			},
			notAvailable: string;
			bestSeller: string;
		},
		foodAllergyAndRiskDisclaimer: string;
	};
}

export type Lang = 'es' | 'en';
