import { useState } from "react";

import { FAQItemProps } from "../types/FAQ";

export default function FAQItem({ question, answer }: FAQItemProps) {
	const [collapsed, setCollapsed] = useState(true);

	return (
		<div className="mb-[35px] sm:flex sm:flex-[40%] flex-col">
			<button
				className="md:text-[18px] sm:text-[17px] leading-[30px] underline underline-offset-[5px] decoration-[#00000050] decoration-dotted hover:no-underline text-left"
				onClick={() => setCollapsed(!collapsed)}
			>
				{question}
			</button>
			<div className={`panel-expand ${!collapsed && "panel-expanded"}`}>
				<div className="panel-expand-content mt-[20px]">
					<p className="whitespace-pre-line">{answer}</p>
				</div>
			</div>
		</div>
	);
}
