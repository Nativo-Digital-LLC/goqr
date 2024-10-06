import faqs from "../constants/FAQs";

export default function FAQ() {
	return (
		<div className="h-auto bg-[--tertiary] pb-[40px] px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="text-[25px] font-[700] mb-[40px]">
					QRCode menu FAQ
				</h2>
			</div>
			<div>
				{faqs.map((item, index) => (
					<div key={index} className="mb-[35px]">
						<a
							className="leading-[30px] underline underline-offset-[5px] decoration-[#00000050] decoration-dotted hover:no-underline"
							href="/"
						>
							{item}
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
