import InformationLine from "../../../../assets/images/landing/information-line.png";

import "./index.css";

export default function Information() {
	return (
		<div className="information-container section-parent">
			<div className="section-child">
				<h2 className="title">¿Qué es?</h2>
				<p className="mb-[50px]">
					Nuestro servicio ofrece a los restaurantes una herramienta
					eficiente y moderna para presentar sus{" "}
					<span className="inline-block relative">
						<b>menús de forma digital.</b>
						<img
							src={InformationLine}
							alt="Information line"
							className="absolute"
						/>
					</span>
				</p>
				<p>
					A través de un código QR, los clientes pueden acceder al
					menú desde sus smartphones, sin necesidad de descargar
					aplicaciones.
				</p>
			</div>
		</div>
	);
}
