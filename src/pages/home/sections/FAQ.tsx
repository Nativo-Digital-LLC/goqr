import faq from "../constants/FAQ";

export default function FAQ() {
	return (
		<div className="h-auto bg-[--tertiary] pb-[40px] px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="text-[25px] font-[700] mb-[40px]">
					QRCode menu FAQ
				</h2>
			</div>
			<div className="sm:flex sm:flex-wrap sm:columns-2 sm:justify-between sm:[&>*:nth-child(odd)]:mr-[10px] sm:[&>*:nth-child(even)]:ml-[10px]">
				{faq.map((item, index) => (
					<div
						key={index}
						className="mb-[35px] sm:flex sm:flex-[40%]"
					>
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
