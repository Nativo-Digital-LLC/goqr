export default function Navigation() {
	return (
		<div className={`py-4 px-[25px] bg-[--primary] flex justify-between`}>
			<a
				href="/"
				className={`text-[25px] relative before:content-[''] before:absolute before:bg-[--secondary] before:h-[7px] before:w-[75px] before:z-[1] before:bottom-[7px] before:left-[-3px]`}
			>
				<b className="z-[2] relative">GoQr</b>
			</a>
			<div className="items-center flex">
				<a href="/" className="mx-5">
					Login
				</a>
				<a
					href="/"
					className="bg-[--secondary] px-4 py-[6px] rounded-[7px] text-[--tertiary]"
				>
					Create menu
				</a>
			</div>
		</div>
	);
}
