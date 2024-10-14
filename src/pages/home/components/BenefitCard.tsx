import { BenefitCardProps } from "../types/Benefit";

export default function BenefitCard(props: BenefitCardProps) {
	const { title, description, image, alt } = props;

	return (
		<div className="sm:max-w-[890px] relative bg-[--tertiary] drop-shadow-lg flex justify-between items-center px-[30px] pt-[20px] pb-[30px] mt-[40px]">
			<div className="z-[1] mr-[32px] sm:w-[60%]">
				<h3 className="sm:text-[25px] text-[22px] font-[700] mb-[10px] leading-[28px]">
					{title}
				</h3>
				<div>
					{description.map((item, index) => (
						<span className="block mb-[15px]" key={index}>
							{item}
						</span>
					))}
				</div>
			</div>
			<div className="absolute w-[90px] top-[5px] right-[5px] opacity-[0.6] sm:relative sm:w-[20%] sm:opacity-[1]">
				<img src={image} alt={alt} />
			</div>
		</div>
	);
}
