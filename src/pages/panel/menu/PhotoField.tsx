import { useEffect, useMemo, useState } from "react";
import { ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

/** `value`: undefined = sin cambios, null = quitar, File = foto nueva. */
export function PhotoField({
	value,
	currentUrl,
	onChange,
	disabled,
	label = "Foto",
	alt = "Foto del producto",
}: {
	value: File | null | undefined;
	currentUrl: string | null;
	onChange: (value: File | null | undefined) => void;
	disabled?: boolean;
	label?: string;
	alt?: string;
}) {
	const [error, setError] = useState(false);
	const preview = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);
	useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
	const src = value === undefined ? currentUrl : preview;

	const pick = (file?: File) => {
		if (!file) return;
		if (!TYPES.includes(file.type) || file.size > MAX_BYTES) return setError(true); // conserva el valor anterior
		setError(false);
		onChange(file);
	};

	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm font-semibold">{label}</span>
			<div className="flex items-stretch gap-4">
				<div className="flex size-[140px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-muted-foreground">
					{src ? <img src={src} alt={alt} className="size-full object-cover" /> : <ImageIcon size={28} aria-hidden />}
				</div>
				<label
					className="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background p-4 text-center focus-within:ring-[3px] focus-within:ring-ring/50"
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						e.preventDefault();
						if (!disabled) pick(e.dataTransfer.files[0]);
					}}
				>
					<ImageIcon size={24} className="text-muted-foreground" aria-hidden />
					<span className="text-sm font-semibold">{src ? "Cambiar foto" : "Subir foto"}</span>
					<span className="text-[13px] text-muted-foreground">Arrastra o toca para subir.</span>
					<input
						type="file"
						accept="image/jpeg,image/png,image/webp"
						className="absolute size-px opacity-0"
						disabled={disabled}
						onChange={(e) => {
							pick(e.target.files?.[0]);
							e.target.value = "";
						}}
					/>
				</label>
			</div>
			{error && <span role="alert" className="text-sm text-destructive">Usa una imagen JPG, PNG o WEBP de hasta 10 MB.</span>}
			{src && (
				<Button type="button" variant="ghost" className="self-start" disabled={disabled} onClick={() => { setError(false); onChange(null); }}>
					Quitar foto
				</Button>
			)}
		</div>
	);
}
