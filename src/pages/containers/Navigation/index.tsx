import { useState } from "react";
import { Link } from "react-router-dom";

import "./index.css";

export default function Navigation({ url }: { url: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const selectedClass = "border-b-[2px] border-b-[var(--text)] font-[800]";

	return (
		<div
			className={`navigation-container section-parent ${
				isOpen && "navigation-container-active"
			}`}
		>
			<ul>
				<li className={`${url == "home" && selectedClass}`}>
					<Link to="/">Inicio</Link>
				</li>
				{/* <li>
					<Link to="">Blog</Link>
				</li> */}
				<li className={`${url == "register" && selectedClass}`}>
					<Link to="/register">Crea tu menú</Link>
				</li>
				<li className={`${url == "login" && selectedClass}`}>
					<Link to="/login">Ingresar </Link>
				</li>
			</ul>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="navigation-menu-bars"
			>
				<div />
				<div />
				<div />
			</button>
		</div>
	);
}
