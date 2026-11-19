import { DictionaryProps } from '../types/Dictionary';

const dictionary: DictionaryProps = {
	menu: {
		establishment: {
			leaveReview: 'Leave us a Google review'
		},
		open: 'Open',
		closesAt: 'closes',
		closed: 'Closed',
		opensAt: 'opens',
		directions: 'Directions',
		call: 'Call',
		whatsapp: 'WhatsApp',
		search: 'Search the menu',
		cancel: 'Cancel',
		resultsFor: (n, q) => (n === 1 ? '1 result' : `${n} results`) + ` for “${q}”`,
		noResultsTitle: (q) => `We couldn't find “${q}”`,
		noResultsBody: 'Try another word or browse the menu categories.',
		seeFullMenu: 'See the full menu',
		product: {
			price: {
				free: 'Free'
			},
			notAvailable: 'Sold out today',
			bestSeller: 'Best seller'
		},
		chooseSubcategory: (category) => `Choose a type of ${category}`,
		emptyCategory: 'There are no dishes in this category yet.',
		emptyMenu: 'This menu has no categories yet.',
		allergyTitle: 'Before you order…',
		foodAllergyAndRiskDisclaimer: 'If you have a food allergy, please speak to any member of our staff. The FDA warns that consuming raw or undercooked meats, poultry, shellfish, or eggs increases the risk of foodborne illness.',
		allergyAccept: 'Got it, see the menu',
		allergyNote: 'Shown only on your first visit.',
		allergyInfo: 'Allergy information',
		unavailableTitle: "The menu isn't available right now",
		unavailableBody: 'Ask your server for the menu or contact the restaurant. It will be back here very soon.',
		writeWhatsapp: 'Message on WhatsApp',
		callRestaurant: 'Call the restaurant',
		notFoundTitle: "We couldn't find this menu",
		notFoundBody: 'Check that the link or QR code is complete. The restaurant may have changed its address.',
		notFoundCta: 'Own a restaurant? Create your menu',
		goHome: 'Go to goqr.com.do',
		schedule: 'Hours',
		today: 'Today',
		map: 'Map',
		contact: 'Contact',
		poweredBy: 'Powered by GoQR'
	}
}

export default dictionary;
