import { useEffect, useMemo } from "react";

// URL local para mostrar de inmediato el archivo elegido; se libera al cambiar o desmontar.
export function useFilePreview(file: File | null | undefined): string | null {
	const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
	useEffect(() => () => {
		if (url) URL.revokeObjectURL(url);
	}, [url]);
	return url;
}
