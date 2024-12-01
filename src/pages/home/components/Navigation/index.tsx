import { useState } from "react";
import { Link } from "react-router-dom";

import "./index.css";

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className={`navigation-container section-parent ${
				isOpen && "navigation-container-active"
			}`}
		>
			<ul>
				<li>
					<Link to="">Inicio</Link>
				</li>
				<li>
					<Link to="">Blog</Link>
				</li>
				<li>
					<Link to="">Crea tu menú</Link>
				</li>
				<li>
					<Link to="">Ingresar </Link>
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
