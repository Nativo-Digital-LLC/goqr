import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./Logo";

// Anclas absolutas ("/#...") para que funcionen también desde /terms, /privacy, etc.
const links = [
	{ href: "/#como-funciona", label: "Cómo funciona" },
	{ href: "/#precios", label: "Precios" },
	{ href: "/#preguntas", label: "Preguntas" },
];

const focus =
	"rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function MarketingHeader() {
	return (
		<header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5">
			<Link to="/" aria-label="GoQR, inicio" className={focus}>
				<Logo />
			</Link>

			<nav aria-label="Principal" className="hidden items-center gap-7 text-[15px] font-medium md:flex">
				{links.map((l) => (
					<a key={l.href} href={l.href} className={`text-primary ${focus}`}>
						{l.label}
					</a>
				))}
				<Link to="/login" className={`font-semibold text-primary ${focus}`}>
					Ingresar
				</Link>
				<Button asChild className="h-11 rounded-xl bg-brand px-5 font-bold text-brand-foreground hover:bg-brand-hover">
					<Link to="/register">Prueba gratis</Link>
				</Button>
			</nav>

			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Abrir menú"
						className="size-11 rounded-xl bg-white text-primary md:hidden"
					>
						<Menu className="size-[22px]" />
					</Button>
				</SheetTrigger>
				<SheetContent side="right" className="bg-crema">
					<SheetTitle className="sr-only">Menú</SheetTitle>
					<SheetDescription className="sr-only">Navegación principal</SheetDescription>
					<nav aria-label="Móvil" className="mt-10 flex flex-col gap-2 p-4 text-lg font-medium">
						{links.map((l) => (
							<SheetClose asChild key={l.href}>
								<a href={l.href} className={`flex h-11 items-center text-primary ${focus}`}>
									{l.label}
								</a>
							</SheetClose>
						))}
						<SheetClose asChild>
							<Link to="/login" className={`flex h-11 items-center font-semibold text-primary ${focus}`}>
								Ingresar
							</Link>
						</SheetClose>
						<SheetClose asChild>
							<Button asChild className="mt-2 h-11 rounded-xl bg-brand font-bold text-brand-foreground hover:bg-brand-hover">
								<Link to="/register">Prueba gratis</Link>
							</Button>
						</SheetClose>
					</nav>
				</SheetContent>
			</Sheet>
		</header>
	);
}

export default MarketingHeader;
