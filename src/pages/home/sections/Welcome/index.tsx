import MockupImg from "../../../../assets/images/landing/mockup.png";

import "./index.css";

export default function Welcome() {
	return (
		<div className="welcome-container section-parent">
			<div className="section-child flex flex-col justify-center items-center">
				<h1 className="">
					<span className="text-[var(--primary)]" >GoQR</span>
					<span className="w-[250px]">Menú Digital</span>
				</h1>
				<button>
					<span>¡Empieza aquí!</span>
				</button>
				<img src={MockupImg} alt="Mockup Image" />
			</div>
		</div>
	);
}
