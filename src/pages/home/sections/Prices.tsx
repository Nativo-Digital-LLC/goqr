import PriceImage1 from "../../../assets/images/prices/price-1.svg";
import PriceImage2 from "../../../assets/images/prices/price-2.svg";

import PriceCard from "../components/PriceCard";
import prices from "../constants/Prices";

export default function Prices() {
	return (
		<div className="md:pb-[80px] h-auto bg-[--primary] pb-[40px] px-[20px] relative z-[3] pt-[20px] flex justify-center">
			<div className="max-w-[890px] relative w-full">
				<div className="flex flex-col justify-center items-center">
					<h2 className="md:text-[35px] sm:text-[30px] text-[25px] font-[700] mb-[40px] relative z-[2]">
						QrCode menu service prices
					</h2>
					<div className="flex flex-col justify-center relative z-[2] items-center sm:flex-row">
						{prices.map((item, index) => (
							<PriceCard
								key={index}
								{...item}
								selected={index === 1}
							/>
						))}
					</div>
					<div className="mb-[20px] sm:mb-[40px]">
						<span className="font-[500] text-[10px]">
							VAT may be applicable
						</span>
					</div>
					<div className="sm:max-w-[500px] relative z-[2] bg-[--tertiary] p-[25px] rounded-[20px] shadow-md shadow-[#00000030] flex flex-col justify-center items-center">
						<h3 className="text-[22px] font-[700] mb-[20px]">
							Free QR code menu for a month
						</h3>
						<p className="mb-[25px] text-[17px] text-center">
							You can try our QR code menu service first, and then
							decide does it suits you or not. It's free and we do
							not ask for your credit card details.
						</p>
						<a
							href="/"
							className="bg-[--secondary] px-[25px] py-[8px] rounded-[7px] shadow-md shadow-[#00000030] text-[--tertiary] text-[18px] font-[500]"
						>
							Try it for free
						</a>
					</div>
				</div>
				<div className="hidden sm:block sm:w-full">
					<div className="absolute bottom-[110px] left-[-30px]">
						<img src={PriceImage1} alt="QR code menu for free" />
					</div>
					<div className="absolute top-[50px] right-[-40px]">
						<img src={PriceImage2} alt="Digital menu prices" />
					</div>
				</div>
			</div>
		</div>
	);
}
