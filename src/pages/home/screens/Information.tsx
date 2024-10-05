import { MenuExample1Jpg } from "../../../constants/LandingImages";

export default function Information() {
	return (
		<div className="h-auto bg-[--tertiary] py-[40px] px-[20px] relative z-[3]">
			<div className="text-center">
				<h2 className="text-[25px] font-[700] mb-[40px]">
					QrCode menu
				</h2>
			</div>
			<div className="flex flex-col-reverse justify-center items-center">
				<div className="rounded-[52px] border-[7px] border-[#E2E3E4] shadow-xl shadow-[#00000020]">
					<div className="relative flex justify-center  rounded-[46px] border-[10px] border-[--text] overflow-hidden">
						<div className="z-1 absolute w-[120px] h-[30px] bg-[--text] rounded-[100px] translate-y-[-12px]" />
						<img
							src={MenuExample1Jpg}
							alt="Qr menu design"
							className="w-[300px] rounded-[35px]"
						/>
					</div>
				</div>
				<div className="text-justify text-[18px] font-[400]">
					<p className="mb-[30px]">
						Our menu service includes a whole range of functions for
						the restaurant, cafe or bar.
					</p>
					<p className="mb-[30px]">
						For your guests - this is a modern, easy to use QR code
						menu.
					</p>
					<p className="mb-[30px]">
						For you - this is an digital platform built around your
						QR code menu for improving a quality of customer service
						and increasing sales.
					</p>
					<p className="mb-[30px]">
						No purchasing expensive terminals for you and no
						application installation on your guests phones needed
						for our digital menu to work.
					</p>
				</div>
			</div>
		</div>
	);
}
