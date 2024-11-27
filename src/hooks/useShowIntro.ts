import { useEffect, useState } from "react"

export const useShowIntro = () => {
	const [showIntro, setShowIntro] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setShowIntro(false);
		}, 5000);
	}, []);

	return showIntro;
}
