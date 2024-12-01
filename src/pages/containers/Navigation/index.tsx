import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./index.css";

export default function Navigation({ url }: { url: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [y, setY] = useState(window.scrollY);
	const [isSticky, setIsSticky] = useState(false);

	const selectedClass = "border-b-[2px] border-b-[var(--text)] font-[800]";

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

	useEffect(() => {
		setY(window.scrollY);
		window.addEventListener("scroll", handleNavigation);

		return () => {
			window.removeEventListener("scroll", handleNavigation);
		};
	}, [handleNavigation]);

	return (
		<div
			className={`navigation-container ${
				isOpen && "navigation-container-active"
			} ${isSticky && "navigation-container-sticky"}`}
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
