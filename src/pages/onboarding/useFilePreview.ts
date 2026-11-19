import { useEffect, useMemo } from "react";

// URL local para mostrar de inmediato el archivo elegido; se libera al cambiar o desmontar.
export function useFilePreview(file: File | null | undefined): string | null {
	const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
	useEffect(() => () => {
		if (url) URL.revokeObjectURL(url);
	}, [url]);
	return url;
}

// Arrastrar y soltar con la misma restricción que accept="image/*" del input.
export function imageDrop(setFile: (f: File) => void) {
	return {
		onDragOver: (e: React.DragEvent) => e.preventDefault(),
		onDrop: (e: React.DragEvent) => {
			e.preventDefault();
			const f = e.dataTransfer.files[0];
			if (f?.type.startsWith("image/")) setFile(f);
		},
	};
}
