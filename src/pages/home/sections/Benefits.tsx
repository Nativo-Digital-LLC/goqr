import BenefitCard from "../components/BenefitCard";
import benefits from "../constants/Benefits";

export default function Benefits() {
	return (
		<div className="md:py-[80px] h-auto bg-[--primary] py-[40px] px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="text-[25px] font-[700] mb-[20px] md:text-[35px] sm:text-[30px]">
					Beneficios de un Menú QR
				</h2>
			</div>
			<div className="flex flex-col justify-center items-center">
				{benefits.map((item, index) => (
					<BenefitCard key={index} {...item} />
				))}
			</div>
		</div>
	);
}
