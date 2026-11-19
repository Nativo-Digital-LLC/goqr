import { DictionaryProps } from '../types/Dictionary';

const dictionary: DictionaryProps = {
	menu: {
		establishment: {
			leaveReview: 'Déjanos tu reseña en Google'
		},
		open: 'Abierto',
		closesAt: 'cierra',
		closed: 'Cerrado',
		opensAt: 'abre',
		directions: 'Cómo llegar',
		call: 'Llamar',
		whatsapp: 'WhatsApp',
		search: 'Buscar en el menú',
		cancel: 'Cancelar',
		resultsFor: (n, q) => (n === 1 ? '1 resultado' : `${n} resultados`) + ` para «${q}»`,
		noResultsTitle: (q) => `No encontramos «${q}»`,
		noResultsBody: 'Prueba con otra palabra o revisa las categorías del menú.',
		seeFullMenu: 'Ver todo el menú',
		product: {
			price: {
				free: 'Gratis'
			},
			notAvailable: 'Agotado por hoy',
			bestSeller: 'Más vendido'
		},
		chooseSubcategory: (category) => `Elige un tipo de ${category.toLowerCase()}`,
		emptyCategory: 'Todavía no hay platos en esta categoría.',
		emptyMenu: 'Este menú todavía no tiene categorías.',
		allergyTitle: 'Antes de pedir…',
		foodAllergyAndRiskDisclaimer: 'Si tiene una alergia alimentaria, por favor hable con cualquier miembro de nuestro personal. La FDA advierte que consumir carnes crudas o poco cocidas, aves, mariscos o huevos aumenta el riesgo de enfermedades transmitidas por los alimentos.',
		allergyAccept: 'Entendido, ver el menú',
		allergyNote: 'Solo se muestra en tu primera visita.',
		allergyInfo: 'Información sobre alergias',
		unavailableTitle: 'El menú no está disponible en este momento',
		unavailableBody: 'Pídele el menú a tu mesero o contacta al restaurante. Volverá a estar aquí muy pronto.',
		writeWhatsapp: 'Escribir por WhatsApp',
		callRestaurant: 'Llamar al restaurante',
		notFoundTitle: 'No encontramos este menú',
		notFoundBody: 'Revisa que el enlace o el código QR estén completos. Puede que el restaurante haya cambiado su dirección.',
		notFoundCta: '¿Tienes un restaurante? Crea tu menú',
		goHome: 'Ir a goqr.com.do',
		schedule: 'Horario',
		today: 'Hoy',
		map: 'Mapa',
		contact: 'Contacto',
		poweredBy: 'Powered by GoQR'
	}
}

export default dictionary;
