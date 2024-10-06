import { PriceCardProps } from "../types/Prices";

export default function PriceCard(props: PriceCardProps) {
	const { title, price, disclaimer, total, selected } = props;

	const defaultStyles = selected
		? "bg-[--secondary] w-[210px] h-[285px]"
		: "bg-[--tertiary] w-[200px] h-[250px]";

	return (
		<div
			className={`${defaultStyles} pt-[20px] pb-[30px] mb-[20px] shadow-md shadow-[#00000030] rounded-[25px] flex flex-col justify-between items-center sm:mb-[0px]`}
		>
			<div>
				<div className="mb-[20px]">
					<span className="font-[700] text-[12px]">{title}</span>
				</div>
				<div className="flex justify-center items-center">
					<span
						className={`${
							selected
								? "text-[--tertiary]"
								: "text-[--secondary]"
						} font-[500] text-[25px] flex items-center`}
					>
						$<b className="text-[65px]">{price}</b>
					</span>
				</div>
			</div>
			<div className="font-[500] text-[10px] text-center">
				<div>
					<span>{disclaimer}</span>
				</div>
				<div>
					<span>Total amount is ${total}</span>
				</div>
			</div>
		</div>
	);
}
