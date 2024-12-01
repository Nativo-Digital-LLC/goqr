import { ReactNode } from "react";
import { ScrollRestoration } from "react-router-dom";

import Navigation from "./Navigation";
import Footer from "./Footer";

import "./index.css";

interface HomeContainerProps {
	children: ReactNode;
	url: string;
}

export default function HomeContainer(props: HomeContainerProps) {
	const { children, url } = props;
	return (
		<div className="home-container">
			<Navigation url={url} />
			{children}
			<Footer />
			<ScrollRestoration />
		</div>
	);
}
