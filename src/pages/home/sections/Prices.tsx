import { Link } from "react-router-dom";
import PriceImage1 from "../../../assets/images/prices/price-1.svg";
import PriceImage2 from "../../../assets/images/prices/price-2.svg";

import PriceCard from "../components/PriceCard";
import prices from "../constants/Prices";

export default function Prices() {
	return (
		<div className="md:pb-[40px] h-auto bg-[--primary] pb-[40px] px-[20px] relative z-[3] pt-[20px] flex justify-center">
			<div className="max-w-[890px] relative w-full">
				<div className="flex flex-col justify-center items-center">
					<h2 className="md:text-[35px] sm:text-[30px] text-[25px] font-[700] mb-[40px] relative z-[2]">
						Precios
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
					<div className="mb-[0] sm:mb-[0]">
						<span className="font-[500] text-[10px]">
							ITBIS Incluido
						</span>
					</div>
					{/* <div className="sm:max-w-[500px] relative z-[2] bg-[--tertiary] p-[25px] rounded-[20px] shadow-md shadow-[#00000030] flex flex-col justify-center items-center">
						<h3 className="text-[22px] font-[700] mb-[20px]">
							Prueba GoQR por 1 mes totalmente <u>gratis</u>
						</h3>
						<p className="mb-[25px] text-[17px] text-center">
							Puedes probar nuestro servicio de menú de códigos QR y luego decidir si le conviene o no.
							<br />
							<br />
							<i>Es gratis y no requiere tarjeta de crédito.</i>
						</p>
						<Link
							to="/register"
							className="bg-[--secondary] px-[25px] py-[8px] rounded-[7px] shadow-md shadow-[#00000030] text-[--tertiary] text-[18px] font-[500]"
						>
							Pruebalo Gratis!
						</Link>
					</div> */}
				</div>
				{/* <div className="hidden sm:block sm:w-full">
					<div className="absolute bottom-[110px] left-[-30px]">
						<img src={PriceImage1} alt="QR code menu for free" />
					</div>
					<div className="absolute top-[50px] right-[-40px]">
						<img src={PriceImage2} alt="Digital menu prices" />
					</div>
				</div> */}
			</div>
		</div>
	);
}
