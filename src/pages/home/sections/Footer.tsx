export default function Footer() {
	return (
		<div className="flex justify-between items-center px-[20px] pb-[30px]">
			<div className="flex flex-col justify-between">
				<a
					href="/"
					className={`text-[25px] relative before:content-[''] before:absolute before:bg-[--secondary] before:h-[7px] before:w-[75px] before:z-[1] before:bottom-[7px] before:left-[-3px]`}
				>
					<b className="z-[2] relative">GoQr</b>
				</a>
				<div className="flex flex-col text-[11px]">
					<a href="/" className="my-[10px]">
						Terms of Service
					</a>
					<span className="opacity-[0.5]">
						© 2024 All rights reserved
					</span>
				</div>
			</div>
			<div className="flex flex-col items-end text-[15px]">
				<a href="/">Contacts</a>
				<a href="/" className="flex justify-center items-center">
					<svg
						className="mr-[5px]"
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
					<b className="text-[--secondary] font-[500]">hello</b>
					@oddmenu.com
				</a>
			</div>
		</div>
	);
}
