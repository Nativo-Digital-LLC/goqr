import { Bar, Footer, Navigation } from "./components";

import {
	Welcome,
	// Information,
	Benefits,
	Prices,
	Services,
	FAQs,
	Information,
	Functionality,
	Contact,
} from "./sections";

import "./index.css";

export default function HomePage() {
	return (
		<div
			className="home-container overflow-y-auto"
			onLoad={(e) => {
				const elements =
					e.currentTarget.getElementsByClassName("faqs-container");
				if (elements.length === 0) return;

				const divElement = elements[0];
				console.log(divElement.getBoundingClientRect().bottom);
			}}
		>
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
			{/*
			<Benefits />
			<div className="flex justify-center">
				<div className="max-w-[890px]">
					<Services />
				</div>
			</div> */}
		</div>
	);
}
