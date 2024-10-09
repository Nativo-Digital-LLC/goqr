import { Subject } from 'rxjs';
import { ID } from 'appwrite';

import { ModalName } from '../types/Modals';
import { storage } from './appwrite';

export const ModalOpener$ = new Subject<{ name: ModalName; extra?: unknown; }>();


/**
 * Funcciones para transformar entradas agregando formatos.
 */
export const format = {
	/**
	 * RNC, Registro Nacional de Contribuyente
	 * @param rnc `string` *sin guiones*
	 *
	 * @example
 	 * 		format.rnc('130800035');
	 *
	 * @returns `string` RNC con formato `130-80003-5`
	 */
	rnc: (rnc: string) => customFormat(rnc, '000-00000-0'),

	/**
	 * Cedula de identidad y electoral dominicana
	 * @param dui numero de cedula *sin guiones*
	 *
	 * @example
 	 * 		format.dui('10225088357');
	 *
	 * @returns `string` Cedula con formato `102-2508835-7`
	 */
	dui: (dui: string) => customFormat(dui, '000-0000000-0'),

	/**
	 * Numero de telefono dominicano
	 * @param phone numero telefonico *sin guiones ni espacios ni parentesis*
	 *
	 * @example
 	 * 		format.phone('8093458812');
	 *
	 * @returns `string` Numero Telefonico con formato `(809) 345-8812`
	 */
	phone: (phone: string) => customFormat(phone, '(000) 000-0000'),

	/**
	 * Formato Moneda
	 * @param cash Monto
	 * @param decimals `0 | 1 | 2` Cantidad de decimales, Por defecto 0
	 *
	 * @example
 	 * 		format.cash(4623, 2); -> '4,623.00'
 	 * 		format.cash(4623, 1); -> '4,623.0'
 	 * 		format.cash(4623);    -> '4,623'
	 *
	 * @returns Monto con format de moneda `9,000.00`
	 */
	cash: (amount: number, decimals = 0, decimalsRequired = false) =>
		Intl.NumberFormat(
			'en-US', {
				minimumFractionDigits: (decimalsRequired || amount % 1 !== 0 ) ? decimals : 0,
				maximumFractionDigits: decimals
			}
		).format(amount),

	/**
	 * Formatea cadenas de texto segun ejemplo introducido
	 * @param input texto sin formato
	 * @param example ejemplo de texto formateado
	 *
	 * @example
	 * 		format.custom('99511469110', '0000-0000-00-0');
	 */
	custom: customFormat
}

export function customFormat(input: string, example: string) {
	/**
	 * Validamos que la longitud del ejemplo (tras remover los caracaters especiales)
	 * sea la misma que la del input
	 */
	if (input.length !== example.replace(/[^0-0A-Za-z]/g, '').length) {
		return 'Entrada Invalida'
	}

	const inputArr = input.split('')

	//Expresion regular para encontrar caracteres eseciales
	const isSpecial = new RegExp(/[^0-9A-Za-z]/)

	//Obtenemos los caracteres especiales y sus posiciones
	example.split('').forEach((char, index) => {
		if (isSpecial.test(char))
			inputArr.splice(index, 0, char)
	})

	return inputArr.join('')
}

/**
 * Evita que un input pueda recibir caracteres no numericos
 * Esta funcion puede ser insertada en un Event Listener de tipo keydown
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function avoidNotNumerics(event: any, decimals = 0){
	if(['Backspace', 'Delete', 'Tab', 'ArrowRight', 'ArrowLeft', 'Enter'].includes(event.key))
		return;

	if(event.key === ' ')
		return event.preventDefault();

	if(!decimals && event.key === '.')
		return event.preventDefault();

	const hasPoint = event.target.value.includes('.');
	const limitDecimals = hasPoint && event.target.value.split('.').pop().length === decimals;
	if(limitDecimals)
		return event.preventDefault()

	const isFirstPoint = (event.key === '.' && !event.target.value.includes('.'));
	const isNumber = !isNaN(Number(event.key));
	if(!isNumber && !isFirstPoint)
		event.preventDefault();
}

export async function uploadFile(file: File) {
	const { $id } = await storage.createFile(
		import.meta.env.VITE_APP_WRITE_BUCKET_ID,
		ID.unique(),
		file
	);

	const url = await storage.getFilePreview(
		import.meta.env.VITE_APP_WRITE_BUCKET_ID,
		$id,
		720
	);

	return url;
}

export const isAppleDevice = /iPhone|iPad|iPod|Macintosh|MacIntel/.test(navigator.userAgent);
