import PriceCard from "../components/PriceCard";
import prices from "../constants/Prices";

export default function Prices() {
	return (
		<div className="h-auto bg-[--primary] pb-[40px] pt px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="text-[25px] font-[700] mb-[40px]">
					QrCode menu service prices
				</h2>
				<div className="flex flex-col justify-center items-center">
					{prices.map((item, index) => (
						<PriceCard
							key={index}
							{...item}
							selected={index === 1}
						/>
					))}
				</div>
				<div className="mb-[10px]">
					<span className="font-[500] text-[10px]">
						VAT may be applicable
					</span>
				</div>
				<div className="bg-[--tertiary] p-[25px] rounded-[20px] shadow-md shadow-[#00000030] flex flex-col justify-center items-center">
					<h3 className="text-[20px] font-[700] mb-[20px]">
						Free QR code menu for a month
					</h3>
					<p className="mb-[25px] text-[14px]">
						You can try our QR code menu service first, and then
						decide does it suits you or not. It's free and we do not
						ask for your credit card details.
					</p>
					<a
						href="/"
						className="bg-[--secondary] px-[25px] py-[5px] rounded-[7px] shadow-md shadow-[#00000030] text-[--tertiary] font-[500]"
					>
						Try it for free
					</a>
				</div>
				{/* <div>
					<img src={Price1} alt="QR code menu for free" />
				</div>
				<div>
					<img src={Price2} alt="Digital menu prices" />
				</div> */}
			</div>
		</div>
	);
}
