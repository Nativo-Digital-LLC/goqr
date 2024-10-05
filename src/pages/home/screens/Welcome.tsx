import {
	MenuExample1Jpg,
	MenuExample1Webp,
	MenuExample2Jpg,
	MenuExample2Webp,
} from "../../../constants/LandingImages";

export default function Welcome() {
	return (
		<div className="h-auto bg-[--primary] py-4 px-[50px]">
			<div className="max-h-[200px] text-center mb-[100px] flex justify-center items-center flex-col">
				<h1 className="text-center max-w-[270px] text-[35px] leading-none font-[500] mb-[50px]">
					<b className="text-[36px] text-[--secondary] text-center">
						QR Code Menu,
					</b>
					{"\nthat works for you"}
				</h1>
				<a
					href="/"
					className="bg-[--secondary] px-4 py-[6px] rounded-[7px] text-[--tertiary] text-[19px]"
				>
					Create menu
				</a>
			</div>
			<div className="flex max-h-[200px]">
				<div className="rotate-[-4deg] translate-y-[-30px] z-[2] shadow-slate-600 drop-shadow-lg">
					<picture>
						<source srcSet={MenuExample1Webp} type="image/webp" />
						<source srcSet={MenuExample1Jpg} type="image/jpeg" />
						<img
							className="h-auto w-max rounded-[15px]"
							src={MenuExample1Jpg}
							alt="QrCode landing, categories"
						/>
					</picture>
				</div>
				<div className="rotate-[8deg] translate-x-[-10px] scale-[.9] z-[1]">
					<picture>
						<source srcSet={MenuExample2Webp} type="image/webp" />
						<source srcSet={MenuExample2Jpg} type="image/jpeg" />
						<img
							className="h-auto w-max rounded-[15px]"
							src={MenuExample2Jpg}
							alt="QrCode landing, items"
						/>
					</picture>
				</div>
			</div>
		</div>
	);
}
