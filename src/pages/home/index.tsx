import HomeContainer from "../containers/HomeContainer";
import {
	Welcome,
	Information,
	Benefits,
	Prices,
	Services,
	FAQ,
} from "./sections";

export default function HomePage() {
	return (
		<HomeContainer defaultBackgroundColor="--tertiary">
			<Welcome />
			<Information />
			<Benefits />
			<Prices />
			<div className="flex justify-center">
				<div className="max-w-[890px]">
					<Services />
					<FAQ />
				</div>
			</div>
		</HomeContainer>
	);
}
