import {
	Navigation,
	Welcome,
	Information,
	Benefits,
	Prices,
	Services,
	FAQ,
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
			<div>
				<div>
					<div>
						<a href="/">
							<b>QrCode</b>
						</a>
						<a href="/">Terms of Service</a>
						<span>© 2024 All rights reserved</span>
					</div>
					<div>
						<a href="/">Contacts</a>
						<a href="/">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 256 256"
								width="16"
								height="16"
								fill="currentColor"
							>
								<g>
									<path
										d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="16"
									></path>{" "}
									<polyline
										points="224 56 128 144 32 56"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="16"
									></polyline>
								</g>
							</svg>
							<span>hello@oddmenu.com</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
