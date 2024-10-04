import {
	Benefits1,
	Benefits2,
	Benefits3,
	Benefits4,
	MenuExample1Jpg,
	Price1,
	Price2,
} from "../../constants/LandingImages";

import Navigation from "./components/Navigation";
import Welcome from "./components/Welcome";

export default function HomePage() {
	return (
		<div className="landing-page">
			<Navigation />
			<div>
				<Welcome />
				<div className="min-h-screen bg-[#FFF] p-3 z-[3] relative">
					<div>
						<h2>QrCode menu</h2>
					</div>
					<div>
						<div>
							<div></div>
							<img src={MenuExample1Jpg} alt="Qr menu design" />
						</div>
						<div>
							<p>
								Our menu service includes a whole range of
								functions for the restaurant, cafe or bar.
							</p>
							<p>
								For your guests - this is a modern, easy to use
								QR code menu.
							</p>
							<p>
								For you - this is an digital platform built
								around your QR code menu for improving a quality
								of customer service and increasing sales.
							</p>
							<p>
								No purchasing expensive terminals for you and no
								application installation on your guests phones
								needed for our digital menu to work.
							</p>
						</div>
					</div>
				</div>
				<div className="min-h-screen bg-[#FDE8DB] p-3">
					<div>
						<h2>QrCode menu benefits</h2>
					</div>
					<div>
						<div>
							<div>
								<h3>Enhancing Customer Experience</h3>
								<div>
									<span>
										Working with digital menu is easier.
										Loading of the menu is faster. There is
										more useful information in digital menu.
									</span>
								</div>
							</div>
							<div>
								<img
									src={Benefits1}
									alt="QR code menu, enhancing customer experience"
								/>
							</div>
						</div>
						<div>
							<div>
								<h3>Attracting new customers</h3>
								<div>
									<span>
										Guests are able to leave their reviews
										directly from the QR code menu. The more
										reviews - the more new guests are coming
										from reviews.
									</span>
									<span>
										Convenient menu language switch - more
										guests-foreigners.
									</span>
								</div>
							</div>
							<div>
								<img
									src={Benefits2}
									alt="QR code menu, attracting new customers"
								/>
							</div>
						</div>
						<div>
							<div>
								<h3>QR code menu increases sales</h3>
								<div>
									<span>
										Digital QR code menu sells more. Photos
										increase the appetite - the appetite
										increases the average check.
									</span>
									<span>
										Making an order becomes easier. Less
										time to wonder, more spontaneous
										purchases - higher average check.
									</span>
								</div>
							</div>
							<div>
								<img
									src={Benefits3}
									alt="QR code menu, increases sales"
								/>
							</div>
						</div>
						<div>
							<div>
								<h3>Saving business resources</h3>
								<div>
									<span>
										Our QR code menu is easy to edit. Higher
										relevance of the menu, less time and
										money spent on updating the menu.
									</span>
									<span>
										Our QR menu works right away. No need to
										install applications, buy terminals,
										wait for confirmation etc.
									</span>
								</div>
							</div>
							<div>
								<img
									src={Benefits4}
									alt="QR code menu, saving business resources"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="min-h-screen bg-[#FDE8DB] p-3">
					<div>
						<h2>QrCode menu service prices</h2>
					</div>
					<div>
						<div>
							<span>If paid monthly</span>
							<span>$10</span>
							<span>Charged every month</span>
							<span>Total amount is $10</span>
						</div>
						<div>
							<span>If paid every 6 months</span>
							<span>$9.6</span>
							<span>Charged every 6 months</span>
							<span>Total amount is $57.6</span>
						</div>
						<div>
							<span>If paid annually</span>
							<span>$9</span>
							<span>Charged every 12 months</span>
							<span>Total amount is $108</span>
						</div>
					</div>
					<div>
						<span>VAT may be applicable</span>
					</div>
					<div>
						<h3>Free QR code menu for a month</h3>
						<p>
							You can try our QR code menu service first, and then
							decide does it suits you or not. It's free and we do
							not ask for your credit card details.
						</p>
						<a href="/">Try it for free</a>
					</div>
					<div>
						<img src={Price1} alt="QR code menu for free" />
					</div>
					<div>
						<img src={Price2} alt="Digital menu prices" />
					</div>
				</div>
				<div className="min-h-screen bg-[#FFF] p-3">
					<div>
						<h2>QrCode menu service includes</h2>
					</div>
					<div>
						<ul>
							<li>
								An access to your menu by the link (for social
								networks, your website or google maps)
							</li>
							<li>
								An access to your menu by QR code (for placement
								on tables, windows, showcases, doors etc.)
							</li>
							<li>
								QR code menu with unlimited amount of categories
								and items
							</li>
							<li>
								Both a mobile and a desktop version of the menu
							</li>
							<li>Unlimited amount of viewings for your menu</li>
							<li>An ability to remotely edit your menu</li>
							<li>
								An ability to add employees to manage your menu
							</li>
							<li>
								An ability to add several places into your
								profile, to easily manage a chain of restaurants
							</li>
							<li>
								An ability to hide menu positions with one click
							</li>
							<li>"Temporary unavailable" feature</li>
							<li>"Old price/New Price" feature</li>
							<li>
								An ability to create a multi language QR code
								menu
							</li>
							<li>
								Unlimited photos and description loading for
								your QR code menu
							</li>
							<li>
								Additional restaurant information feature
								(Address, Phone number, Map, Wi-Fi password)
							</li>
							<li>QR code generator for your menu</li>
							<li>Unlimited number of QR code scans</li>
						</ul>
					</div>
				</div>
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
