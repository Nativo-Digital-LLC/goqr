import FunctionalityPhone from "../../../../assets/images/landing/functionality-phone.png";
import FunctionalityBurger from "../../../../assets/images/landing/functionality-burger.png";
import FunctionalityGirl from "../../../../assets/images/landing/functionality-girl.png";
import WigglyArrow from "../../../../assets/images/landing/wiggly-arrow.png";

import "./index.css";

export default function Functionality() {
	return (
		<div className="functionality-container section-parent">
			<div className="section-child flex flex-col items-center mb-[-30px] mt-[-30px]">
				<h2 className="title">¿Cómo funciona?</h2>
				<div className="flex justify-center items-center functionality-card">
					<img
						src={FunctionalityPhone}
						alt="Functionality Phone"
						className="w-[200px]"
					/>
					<div className="w-[50%] ml-[40px] text-right">
						<h3>Escanea el código QR</h3>
						<p className="!text-right">
							Usa la cámara de tu teléfono o una app para escanear
							el código QR disponible en la mesa o área del
							restaurante.
						</p>
					</div>
				</div>
				<img
					src={WigglyArrow}
					alt="Wiggly Arrow Right"
					className="w-[250px] my-[-70px] wiggly-arrow"
				/>
				<div className="functionality-card flex justify-center items-center">
					<div className="w-[50%] mr-[40px] text-left">
						<h3>Explora el menú digital</h3>
						<p>
							Visualiza el menú completo del restaurante
							directamente en tu dispositivo, con imágenes y
							descripciones claras.
						</p>
					</div>
					<img
						src={FunctionalityBurger}
						alt="Functionality Burger"
						className="w-[300px]"
					/>
				</div>
				<img
					src={WigglyArrow}
					alt="Wiggly Arrow Left"
					className="w-[250px] my-[-70px] scale-x-[-1] wiggly-arrow"
				/>
				<div className="functionality-card flex justify-center items-center">
					<img
						src={FunctionalityGirl}
						alt="Functionality Girl"
						className="w-[300px]"
					/>
					<div className="w-[50%] ml-[40px] text-right">
						<h3>Haz tu pedido al mesero</h3>
						<p className="!text-right">
							Una vez que tengas decidido qué ordenar,
							comunícaselo al mesero para que tome tu pedido.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
