import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
	{
		q: "¿Tengo que pagar algo para probar?",
		a: "No. Tienes 30 días gratis con todas las funciones y no te pedimos tarjeta. Al final eliges un plan o tu menú se pausa hasta que lo actives.",
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
		a: "Sí. Cada local tiene su propio menú, su QR y su plan, y los manejas todos desde la misma cuenta.",
	},
	{
		q: "¿Y si necesito ayuda?",
		a: "Escríbenos por WhatsApp o a contacto@goqr.com.do. Si quieres, te ayudamos a montar el menú.",
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
