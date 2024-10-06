import { BenefitCardProps } from "../types/Benefit";

export default function BenefitCard(props: BenefitCardProps) {
	const { title, description, image, alt } = props;

	return (
		<div className="relative bg-[--tertiary] flex justify-between items-center px-[30px] py-[20px] rounded-[6px] shadow-md shadow-[#00000020] mt-[40px]">
			<div className="z-[1] mr-[32px] sm:w-[60%]">
				<h3 className="text-[22px] font-[700] mb-[20px]">{title}</h3>
				<div>
					{description.map((item, index) => (
						<span className="block mb-[15px]" key={index}>
							{item}
						</span>
					))}
				</div>
			</div>
			<div className="absolute w-[90px] top-[5px] right-[5px] opacity-[0.6] sm:relative sm:w-[40%] sm:opacity-[1]">
				<img src={image} alt={alt} />
			</div>
		</div>
	);
}
