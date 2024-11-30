import { Link } from "react-router-dom";

import "./index.css";

export default function Footer() {
	return (
		<div className="footer-container">
			<h3 className="text-[46px] font-[900] tracking-[10px]">GoQr</h3>
			<span className="font-[300]">GoQr © 2024</span>
			<div className="flex flex-col text-right font-[300]">
				<Link to="">Términos y condiciones</Link>
				<Link to="">Política de privacidad</Link>
			</div>
		</div>
	);
}
