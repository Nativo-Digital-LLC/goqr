import { Link } from "react-router-dom";
import {
	MenuExample1Jpg,
	MenuExample1Webp,
	MenuExample2Jpg,
	MenuExample2Webp,
} from "../../../constants/LandingImages";

export default function Welcome() {
	return (
		<div className="md:h-screen md:px-[20px] h-auto bg-[--primary] py-4 px-[50px] flex justify-center">
			<div className="md:flex md:justify-between md:items-center max-w-[890px]">
				<div className="md:max-h-full md:items-start md:text-left max-h-[200px] text-center mb-[100px] flex justify-center items-center flex-col">
					<h1 className="md:text-[43px] md:max-w-[350px] sm:text-[40px] sm:max-w-[300px] max-w-[270px] text-[35px] leading-none font-[500] mb-[50px] whitespace-nowrap">
						<b className="text-[--secondary] block">
							Tu Menú QR,
						</b>
						Sin complicaciones
					</h1>
					<Link
						to="/register"
						className="bg-[--secondary] px-4 py-[4px] rounded-[7px] text-[--tertiary] text-[19px] font-[500]"
					>
						Crear menú
					</Link>
				</div>
				<div className="flex max-h-[200px] md:w-[50%] md:max-h-full">
					<div className="rotate-[-4deg] translate-y-[-30px] z-[2] shadow-slate-600 drop-shadow-lg">
						<picture>
							<source
								srcSet={MenuExample1Webp}
								type="image/webp"
							/>
							<source
								srcSet={MenuExample1Jpg}
								type="image/jpeg"
							/>
							<img
								className="h-auto w-max rounded-[15px]"
								src={MenuExample1Jpg}
								alt="QrCode landing, categories"
							/>
						</picture>
					</div>
					<div className="rotate-[8deg] translate-x-[-10px] scale-[.9] z-[1]">
						<picture>
							<source
								srcSet={MenuExample2Webp}
								type="image/webp"
							/>
							<source
								srcSet={MenuExample2Jpg}
								type="image/jpeg"
							/>
							<img
								className="h-auto w-max rounded-[15px]"
								src={MenuExample2Jpg}
								alt="QrCode landing, items"
							/>
						</picture>
					</div>
				</div>
			</div>
		</div>
	);
}
