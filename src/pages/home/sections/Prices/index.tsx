import prices from "../../constants/Prices";

import oldGuy from "../../../../assets/images/landing/old-guy.png";

import "./index.css";

export default function Prices() {
	return (
		<div className="section-parent prices-container">
			<div className="section-child">
				<h2 className="title text-[var(--primary)]">
					¿Cuáles son los precios?
				</h2>
				<div className="flex justify-center items-center mb-[15px]">
					{prices.map((item, index) => (
						<div className="price-card" key={index}>
							<span>{item.title}</span>
							<div className="flex flex-col items-center">
								<span className="!font-[600] !text-[21px]">
									DOP
								</span>
								<b>{item.price}</b>
							</div>
							<div>
								<p>{item.disclaimer}</p>
								<p>{`Monto total DOP ${item.total}`}</p>
							</div>
						</div>
					))}
				</div>
				<span className="text-[14px]">ITBIS incluido</span>
				<div className="relative flex justify-center mb-[-30px]">
					<img
						src={oldGuy}
						alt="Old Guy"
						className="absolute w-[380px] left-[-95px] bottom-[-55px]"
					/>
					<div className="free-trial-card">
						<h3>¡Prueba Gratis!</h3>
						<p>
							{`Puedes probar GoQR de manera gratuita\n\rdurante un
							mes. No tienes que agregar\nninguna información de
							pago`}
						</p>
						<button>
							<span>¡Empieza aquí!</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
