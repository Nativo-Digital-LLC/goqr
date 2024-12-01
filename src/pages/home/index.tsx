import { Bar, Footer, Navigation } from "./components";

import {
	Welcome,
	Prices,
	FAQs,
	Information,
	Functionality,
	Contact,
} from "./sections";

import "./index.css";

export default function HomePage() {
	return (
		<div className="home-container">
			<Navigation />
			<Welcome />
			<Bar />
			<Information />
			<Functionality />
			<Bar />
			<Prices />
			<FAQs />
			<Bar />
			<Contact />
			<Footer />
		</div>
	);
}
