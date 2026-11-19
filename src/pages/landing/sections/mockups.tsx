const DISHES = [
	{ name: "Croquetas de Pollo", note: "Con salsa de la casa", price: "$7" },
	{ name: "Pastelitos de Pollo", note: "Tres unidades", price: "$2" },
	{ name: "Chicharrón de pollo", note: "Con tostones", price: "$5" },
];

export function MockDish({ name, note, price }: { name: string; note?: string; price: string }) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-border bg-white p-2.5">
			<div className="size-12 shrink-0 rounded-lg bg-[#D9A98A]" aria-hidden="true" />
			<div className="flex min-w-0 flex-1 flex-col text-sm">
				<strong className="truncate">{name}</strong>
				{note && <span className="truncate text-xs text-cacao-2">{note}</span>}
			</div>
			<strong className="text-sm">{price}</strong>
		</div>
	);
}

export function PhoneMenu({ compact = false }: { compact?: boolean }) {
	return (
		<div
			className="w-[280px] rounded-[36px] bg-primary p-2.5 shadow-xl"
			role="img"
			aria-label="Ejemplo de menú digital en un celular"
		>
			<div className="overflow-hidden rounded-[28px] bg-crema">
				<div className="h-28 bg-[#D9A98A]" />
				<div className="flex flex-col gap-3 p-4">
					<div className="flex items-center gap-3">
						<span className="flex size-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
							LR
						</span>
						<div className="flex flex-col text-sm">
							<strong>La Roca Restaurant</strong>
							<span className="text-xs text-cacao-2">El sabor de la cocina dominicana</span>
						</div>
					</div>
					<div className="flex gap-2 text-xs font-medium">
						<span className="rounded-full bg-primary px-3 py-1.5 text-white">Entradas</span>
						<span className="rounded-full border border-line px-3 py-1.5">Sándwiches</span>
						<span className="rounded-full border border-line px-3 py-1.5">Desayunos</span>
					</div>
					{DISHES.slice(0, compact ? 2 : 3).map((d) => (
						<MockDish key={d.name} {...d} />
					))}
				</div>
			</div>
		</div>
	);
}

export function DesktopMenu() {
	return (
		<div
			className="overflow-hidden rounded-2xl border border-line bg-white shadow-xl"
			role="img"
			aria-label="Ejemplo de menú digital en la computadora"
		>
			<div className="flex gap-1.5 border-b border-line bg-crema px-4 py-3">
				<span className="size-2.5 rounded-full bg-line" />
				<span className="size-2.5 rounded-full bg-line" />
				<span className="size-2.5 rounded-full bg-line" />
			</div>
			<div className="grid grid-cols-[160px_1fr] gap-4 bg-crema p-4">
				<div className="flex flex-col gap-2 text-sm">
					<strong>La Roca Restaurant</strong>
					{["Entradas", "Sándwiches", "Desayunos", "Platos fuertes", "Bebidas"].map((c) => (
						<span key={c} className="text-cacao-2">
							{c}
						</span>
					))}
				</div>
				<div className="flex flex-col gap-2">
					{DISHES.map((d) => (
						<MockDish key={d.name} name={d.name} price={d.price} />
					))}
				</div>
			</div>
		</div>
	);
}
