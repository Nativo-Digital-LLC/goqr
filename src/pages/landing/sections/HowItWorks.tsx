const STEPS = [
	{ title: "Crea tu cuenta", text: "Con tu correo o Google. Pones el nombre del negocio, tu logo y tu color. Sin tarjeta." },
	{
		title: "Sube tu menú",
		text: "Categorías, platos, fotos y precios. Lo haces desde el celular o la computadora, a tu ritmo.",
	},
	{
		title: "Imprime tu QR",
		text: "Descarga el QR con tu marca, ponlo en las mesas y listo. Ese QR no cambia nunca.",
	},
];

export function HowItWorks() {
	return (
		<section id="como-funciona" className="mx-auto flex max-w-[1200px] scroll-mt-20 flex-col gap-10 px-5 py-16 md:px-8 md:py-24">
			<div className="flex flex-col gap-3">
				<span className="text-sm font-bold text-brand">Cómo funciona</span>
				<h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
					De cero a QR en la mesa, hoy mismo.
				</h2>
			</div>
			<ol className="grid gap-6 md:grid-cols-3">
				{STEPS.map((s, i) => (
					<li
						key={s.title}
						className="flex gap-4 rounded-3xl bg-white p-5 md:flex-col md:gap-3 md:rounded-none md:bg-transparent md:p-0"
					>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-white">
							{i + 1}
						</span>
						<div className="flex flex-col gap-1 md:gap-3">
							<h3 className="font-display text-xl font-bold">{s.title}</h3>
							<p className="text-cacao-2">{s.text}</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
