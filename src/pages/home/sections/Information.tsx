import { MenuExample1Jpg } from "../../../constants/LandingImages";

export default function Information() {
	return (
		<div className="md:py-[80px] h-auto bg-[--tertiary] py-[40px] px-[20px] relative z-[3] flex justify-center">
			<div className="max-w-[890px]">
				<div className="text-center">
					<h2 className="md:text-[35px] sm:text-[30px] text-[25px] font-[700] mb-[40px]">
						GoQR Menú
					</h2>
				</div>
				<div className="flex flex-col-reverse justify-center items-center sm:flex-row sm:pt-[20px]">
					<div className="rounded-[52px] border-[7px] border-[#E2E3E4] shadow-xl shadow-[#00000020]">
						<div className="relative flex justify-center  rounded-[46px] border-[10px] border-[--text] overflow-hidden">
							<div className="z-1 absolute w-[120px] h-[30px] bg-[--text] rounded-[100px] translate-y-[-12px]" />
							<img
								src={MenuExample1Jpg}
								alt="Qr menu design"
								className="w-[200px] rounded-[35px] sm:w-[700px]"
							/>
						</div>
					</div>
					<div className="text-justify text-[18px] font-[400] sm:ml-[60px] md:ml-[13%] max-w-[480]">
						<p className="mb-[30px]">
							Nuestro servicio de menú incluye toda una gama de
							funciones para el restaurante, cafetería o bar.
						</p>
						<p className="mb-[30px]">
							Para sus invitados: este es un menú de código QR
							moderno y fácil de usar.
						</p>
						<p className="mb-[30px]">
							Para usted, esta es una plataforma digital
							construida alrededor de su menú de códigos QR para
							mejorar la calidad del servicio al cliente y
							aumentar las ventas.
						</p>
						<p className="mb-[30px]">
							No es necesario comprar terminales costosas ni
							instalar aplicaciones en los teléfonos de sus
							invitados para que nuestro menú digital funcione.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
