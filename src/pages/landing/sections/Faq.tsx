import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
	{
		q: "¿Tengo que pagar algo para probar?",
		a: "No. Tienes 30 días gratis con todas las funciones y no te pedimos tarjeta. Al terminar no se cobra nada sin tu autorización: eliges una forma de pago o tu menú público se pausa hasta que pagues.",
	},
	{
		q: "¿Hay límite de platos o de fotos?",
		a: "No. Puedes subir todos los platos y fotos que quieras, sin límite.",
	},
	{
		q: "¿Hay planes distintos?",
		a: "No. Es un solo producto a RD$500 al mes, con todo incluido. Mensual, anual y de por vida son formas de pago, no planes con menos funciones. Cancelas cuando quieras desde tu panel.",
	},
	{
		q: "¿Qué pasa con mi menú y mi QR si dejo de pagar?",
		a: "El QR es tuyo y nunca cambia: sigue siendo el mismo. Tu menú público se pausa y se reactiva en cuanto pagas de nuevo.",
	},
	{
		q: "Si cambio un precio, ¿tengo que imprimir otro QR?",
		a: "No. El QR siempre lleva al mismo enlace y los cambios se ven al instante.",
	},
	{
		q: "¿Cuánto tardo en tenerlo listo?",
		a: "La cuenta y el QR, unos 10 minutos. El menú completo depende de cuántos platos tengas; puedes ir agregándolos poco a poco.",
	},
	{
		q: "¿Cómo pago?",
		a: "Con tarjeta desde tu panel, o por transferencia a nuestras cuentas en RD o EE. UU. subiendo el comprobante. Si necesitas comprobante fiscal, agrega tu RNC.",
	},
	{
		q: "¿Puedo tener varios locales?",
		a: "Sí. Cada local tiene su propio menú, su QR y su suscripción, y se cobran por separado: pagas RD$500 al mes por cada menú, y cada uno tiene sus propios 30 días gratis. Los manejas todos desde la misma cuenta.",
	},
	{
		q: "¿Y si necesito ayuda?",
		a: "Escríbenos a contacto@goqr.com.do. Si quieres, te ayudamos a montar el menú.",
	},
];

export function Faq() {
	return (
		<section id="preguntas" className="mx-auto flex max-w-3xl scroll-mt-20 flex-col gap-8 px-5 py-16 md:py-24">
			<h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Preguntas frecuentes</h2>
			<Accordion type="single" collapsible defaultValue="faq-0">
				{FAQS.map((f, i) => (
					<AccordionItem key={f.q} value={`faq-${i}`}>
						<AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
						<AccordionContent className="text-base text-cacao-2">{f.a}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
