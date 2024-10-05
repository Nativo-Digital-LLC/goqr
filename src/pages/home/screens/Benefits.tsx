import BenefitCard from "../components/BenefitCard";
import benefits from "../constants/Benefits";

export default function Benefits() {
	return (
		<div className="h-auto bg-[--primary] py-[40px] px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="text-[25px] font-[700] mb-[40px]">
					QrCode menu benefits
				</h2>
			</div>
			<div>
				{benefits.map((item, index) => (
					<BenefitCard key={index} {...item} />
				))}
			</div>
		</div>
	);
}
