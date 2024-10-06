import {
	Navigation,
	Welcome,
	Information,
	Benefits,
	Prices,
	Services,
} from "./screens";

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
				<div className="min-h-screen bg-[#FFF] p-3">
					<div>
						<h2>QRCode menu FAQ</h2>
					</div>
					<div>
						<div>
							<div>
								<h3>
									<button>
										<span>
											I already have menus made of paper,
											why is your digital menu better?
										</span>
									</button>
								</h3>
							</div>
							<div>
								<h3>
									<button>
										<span>
											I already have a QR code menu with a
											PDF file, how is your digital menu
											different from this?
										</span>
									</button>
								</h3>
							</div>
							<div>
								<h3>
									<button>
										<span>
											Do I have to call or to message you
											every time when I want to change
											something at my QR code menu?
										</span>
									</button>
								</h3>
							</div>
							<div>
								<h3>
									<button>
										<span>
											Where can I see what your QR code
											menu looks like?
										</span>
									</button>
								</h3>
							</div>
							<div>
								<h3>
									<button>
										<span>
											Is it possible to try your digital
											menu for free first?
										</span>
									</button>
								</h3>
							</div>
							<div>
								<h3>
									<button>
										<span>
											I want to change the name of my
											restaurant, cafe or bar, but I don’t
											want to print new QR codes for the
											menu, what should I do?
										</span>
									</button>
								</h3>
							</div>
						</div>
					</div>
				</div>
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
