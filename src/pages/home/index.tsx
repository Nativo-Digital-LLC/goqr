import {
	Navigation,
	Welcome,
	Information,
	Benefits,
	Prices,
	Services,
	FAQ,
	Footer,
} from "./sections";

export default function HomePage() {
	return (
		<div className="landing-page">
			<Navigation />
			<div>
				<Welcome />
				<Information />
				<Benefits />
				<Prices />
				<Services />
				<FAQ />
			</div>
			<Footer />
		</div>
	);
}
