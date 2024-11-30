import { Link } from "react-router-dom";

import "./index.css";

export default function Navigation() {
	return (
		<div className="section navigation-container">
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
		</div>
	);
}
