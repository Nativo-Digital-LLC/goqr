import { Link } from "react-router-dom";
import MockupImg from "../../../../assets/images/landing/mockup2.png";

import "./index.css";

export default function Welcome() {
	return (
		<div className="welcome-container section-parent">
			<div className="section-child flex flex-col justify-center items-center">
				<h1>
					<span className="text-[var(--primary)]">GoQR</span>
					<span className="w-[250px]">Menú Digital</span>
				</h1>
				<button className="hover:scale-150 transition-all duration-200">
					<Link to="/register">
						<span>¡Empieza aquí!</span>
					</Link>
				</button>
				<img src={MockupImg} alt="Mockup Image" />
			</div>
		</div>
	);
}
