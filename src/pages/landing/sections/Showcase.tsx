import { DesktopMenu, PhoneMenu } from "./mockups";

export function Showcase() {
	return (
		<section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-16 md:px-8 md:py-24">
			<div className="flex max-w-2xl flex-col gap-3">
				<span className="text-sm font-bold text-brand">En la mesa y en la web</span>
				<h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
					Se ve bien en el celular y también en la computadora.
				</h2>
				<p className="text-cacao-2">
					Comparte el mismo enlace en Instagram, Google y WhatsApp para que te pidan antes de llegar.
				</p>
			</div>
			<div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
				<DesktopMenu />
				<div className="flex justify-center">
					<PhoneMenu compact />
				</div>
			</div>
		</section>
	);
}
