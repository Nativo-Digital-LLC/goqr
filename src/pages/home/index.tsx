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
			<Welcome />
			<Information />
			<Benefits />
			<Prices />
			<div className="flex justify-center">
				<div className="max-w-[890px]">
					<Services />
					<FAQ />
					<Footer />
				</div>
			</div>
		</div>
	);
}
