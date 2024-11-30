import { useEffect, useState } from "react";

import Questions from "../../constants/Questions";

import "./index.css";

export default function FAQs() {
	const [bgColor, setBgColor] = useState("faqs-container-secondary");

	const handleNavigation = () => {
		const y = 4700;
		setBgColor(
			y > window.scrollY
				? "faqs-container-secondary"
				: "faqs-container-tertiary"
		);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleNavigation);

		return () => {
			window.removeEventListener("scroll", handleNavigation);
		};
	}, []);

	return (
		<div className={`section-parent faqs-container ${bgColor} transition-all ease-in-out duration-500`}>
			<div className="section-child">
				<h2 className="title text-[var(--primary)]">
					Preguntas frecuentes
				</h2>
				{Questions.map((item, index) => (
					<Question {...item} key={index} />
				))}
			</div>
		</div>
	);
}

function Question({ question, answer }: { question: string; answer: string }) {
	const [hiddenAnswer, setHiddenAnswer] = useState(true);

	return (
		<button
			className="faqs-card"
			onClick={() => setHiddenAnswer(!hiddenAnswer)}
		>
			<div>
				<span>Pregunta:</span>
				<p>{question}</p>
			</div>
			<div>
				<div
					className={`grid transition-all ease-in-out duration-[300ms] ${
						hiddenAnswer ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
					}`}
				>
					<p className="overflow-hidden underline">
						Presiona aquí para ver la respuesta
					</p>
				</div>
				<div
					className={`grid transition-all ease-in-out duration-[300ms] ${
						hiddenAnswer ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
					}`}
				>
					<div className="overflow-hidden">
						<span>Respuesta:</span>
						<p>{answer}</p>
					</div>
				</div>
			</div>
		</button>
	);
}
