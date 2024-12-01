import { Link } from "react-router-dom";
import StraightArrow from "../../../../assets/images/landing/straight-arrow.png";

import "./index.css";

export default function Contact() {
	return (
		<div className="section-parent contact-container z-[2]" id="contact">
			<div className="section-child">
				<h2 className="title">Contáctanos</h2>
				<div className="relative flex justify-center items-center">
					<div className="contact-card relative">
						<p>
							¡Puedes enviarnos un email a nuestra dirección de
							correo electrónico y nos contactaremos en breve para
							asistirte!
						</p>
						<Link to="mailto:contacto@goqr.com.do">
							<b>contacto@goqr.com.do</b>
						</Link>
						<img
							src={StraightArrow}
							alt="Straight Arrow Right"
							className="w-[140px] mr-[130px] absolute bottom-[23px] left-[-20px] straight-arrow"
						/>
						<img
							src={StraightArrow}
							alt="Straight Arrow Left"
							className="scale-x-[-1] w-[140px] ml-[130px] absolute bottom-[23px] right-[-20px] straight-arrow"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
