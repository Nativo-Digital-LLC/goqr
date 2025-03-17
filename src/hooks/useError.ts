import { AppwriteException } from 'appwrite';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export const useErrorHandler = (error: AppwriteException | null) => {
	useEffect(() => {
		if (!error) {
			return;
		}

		Swal.fire(
			'Error',
			'Se ha producido un error inesperado, por favor intentelo mas tarde.\n\n' +
			`Código: ${error.code}\n` +
			`Detalles: ${error.message}`,
			'error'
		);
	}, [error]);
}
