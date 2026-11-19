import { MarketingLayout } from "@/layouts/MarketingLayout";

import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { Objections } from "./sections/Objections";
import { Pricing } from "./sections/Pricing";
import { Showcase } from "./sections/Showcase";
import { SocialProof } from "./sections/SocialProof";

export default function LandingPage() {
	return (
		<MarketingLayout>
			<Hero />
			<SocialProof />
			<HowItWorks />
			<Objections />
			<Showcase />
			<Pricing />
			<Faq />
			<FinalCta />
		</MarketingLayout>
	);
}
