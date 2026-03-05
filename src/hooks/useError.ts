import { FirebaseError } from 'firebase/app';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import * as Sentry from '@sentry/react';

export const useErrorHandler = (error: FirebaseError | null) => {
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

		Sentry.captureException(error);
	}, [error]);
}
