export interface DictionaryProps {
	menu: {
		establishment: {
			leaveReview: string;
		};
		open: string;
		closesAt: string;
		closed: string;
		opensAt: string;
		directions: string;
		call: string;
		whatsapp: string;
		search: string;
		cancel: string;
		resultsFor: (n: number, q: string) => string;
		noResultsTitle: (q: string) => string;
		noResultsBody: string;
		seeFullMenu: string;
		product: {
			price: {
				free: string;
			},
			notAvailable: string;
			bestSeller: string;
		},
		chooseSubcategory: (category: string) => string;
		emptyCategory: string;
		emptyMenu: string;
		allergyTitle: string;
		foodAllergyAndRiskDisclaimer: string;
		allergyAccept: string;
		allergyNote: string;
		allergyInfo: string;
		unavailableTitle: string;
		unavailableBody: string;
		writeWhatsapp: string;
		callRestaurant: string;
		notFoundTitle: string;
		notFoundBody: string;
		notFoundCta: string;
		goHome: string;
		schedule: string;
		today: string;
		map: string;
		contact: string;
		poweredBy: string;
	};
}

export type Lang = 'es' | 'en';
