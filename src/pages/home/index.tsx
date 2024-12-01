import HomeContainer from "../containers/HomeContainer";

import { Bar } from "./components";

import {
	Welcome,
	Prices,
	FAQs,
	Information,
	Functionality,
	Contact,
} from "./sections";

export default function HomePage() {
	return (
		<HomeContainer>
			<Welcome />
			<Bar />
			<Information />
			<Functionality />
			<Bar />
			<Prices />
			<FAQs />
			<Bar />
			<Contact />
		</HomeContainer>
	);
}
