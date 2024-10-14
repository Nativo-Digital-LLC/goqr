import FAQItem from "../components/FAQItem";
import faq from "../constants/FAQ";

export default function FAQ() {
	return (
		<div className="md:pb-[80px] md:pt-[40px] h-auto bg-[--tertiary] pb-[40px] px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="md:text-[35px] sm:text-[30px] text-[25px] font-[700] mb-[40px]">
					Preguntas frecuentes
				</h2>
			</div>
			<div className="sm:flex sm:flex-wrap sm:columns-2 sm:justify-between sm:[&>*:nth-child(odd)]:mr-[10px] sm:[&>*:nth-child(even)]:ml-[10px]">
				{faq.map((item, index) => (
					<FAQItem key={index} {...item} />
				))}
			</div>
		</div>
	);
}
