import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./index.css";

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const [y, setY] = useState(window.scrollY);
	const [isSticky, setIsSticky] = useState(false);

	const location = useLocation();

	const handleNavigation = useCallback(
		(e: Event) => {
			const window = e.currentTarget as Window;
			if (y > window.scrollY) {
				setIsSticky(true);
			} else if (y < window.scrollY) {
				setIsSticky(false);
			}
			setY(window.scrollY);
		},
		[y]
	);

	const handleResize = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		setY(window.scrollY);
		window.addEventListener("scroll", handleNavigation);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("scroll", handleNavigation);
			window.removeEventListener("resize", handleResize);
		};
	}, [handleNavigation]);

	useEffect(() => {
		setIsOpen(false);
	}, [location]);

	return (
		<div
			className={`navigation-container ${
				isOpen && "navigation-container-active"
			} ${isSticky && "navigation-container-sticky"}`}
		>
			<div className="relative navigation-inner-container flex justify-center">
				<div>
					<h3 className="text-[26px] font-[900]">GoQr</h3>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="navigation-menu-bars"
					>
						<div />
						<div />
						<div />
					</button>
				</div>
				<div>
					<div className="w-[120px]" />
					<ul>
						<li>
							<Link to="/">Inicio</Link>
						</li>
						<li>
							<Link to="/#information">Información</Link>
						</li>
						<li>
							<Link to="/#prices">Precios</Link>
						</li>
						<li>
							<Link to="/#faq">FAQ</Link>
						</li>
						<li>
							<Link to="/#contact">Contacto</Link>
						</li>
					</ul>
					<div>
						<button className="login-button">
							<Link to="/login">Ingresar</Link>
						</button>
						<button className="register-button">
							<Link to="/register">Crear menú</Link>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
