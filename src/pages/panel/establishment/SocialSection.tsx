import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section, type FormValues } from "./Section";

const PLATFORMS = [
	{ value: "instagram", label: "Instagram" },
	{ value: "facebook", label: "Facebook" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "x", label: "X" },
	{ value: "website", label: "Sitio web" },
];

export function SocialSection({ busy }: { busy: boolean }) {
	const { watch, setValue } = useFormContext<FormValues>();
	const rows = watch("social");
	const set = (next: FormValues["social"]) => setValue("social", next, { shouldDirty: true });

	return (
		<Section id="redes" title="Redes sociales">
			{rows.map((r, i) => (
				<div key={i} className="flex items-center gap-2">
					<Select value={r.platform} disabled={busy} onValueChange={(platform) => set(rows.map((x, j) => (j === i ? { ...x, platform } : x)))}>
						<SelectTrigger className="w-[140px] shrink-0" aria-label="Red social"><SelectValue /></SelectTrigger>
						<SelectContent>
							{/* una plataforma vieja que no está en la lista se conserva */}
							{!PLATFORMS.some((p) => p.value === r.platform) && <SelectItem value={r.platform}>{r.platform}</SelectItem>}
							{PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
						</SelectContent>
					</Select>
					<Input aria-label="Enlace" placeholder="@usuario o enlace" disabled={busy} value={r.link} onChange={(e) => set(rows.map((x, j) => (j === i ? { ...x, link: e.target.value } : x)))} />
					<Button type="button" variant="ghost" size="icon" aria-label="Quitar red social" disabled={busy} onClick={() => set(rows.filter((_, j) => j !== i))}>
						<X size={18} />
					</Button>
				</div>
			))}
			<Button type="button" variant="outline" className="self-start" disabled={busy} onClick={() => set([...rows, { platform: "instagram", link: "" }])}>
				<Plus size={18} />
				Añadir red social
			</Button>
		</Section>
	);
}
