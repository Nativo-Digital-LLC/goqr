import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePanel } from "../PanelContext";

const chip = "flex h-11 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 text-[15px] font-semibold";

export function EstablishmentSwitcher() {
	const { establishments, establishment, select } = usePanel();
	const label = (
		<>
			<span className="size-6 shrink-0 rounded-full" style={{ background: establishment.mainHexColor || "#E86B2A" }} />
			<span className="max-w-[40vw] truncate">{establishment.name}</span>
		</>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger aria-label="Cambiar establecimiento" className={`${chip} cursor-pointer`}>
				{label}
				<ChevronDown size={18} />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuRadioGroup value={establishment.id} onValueChange={select}>
					{establishments.map((e) => (
						<DropdownMenuRadioItem key={e.id} value={e.id}>
							{e.name}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to="/onboarding?new=1">Añadir establecimiento</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
