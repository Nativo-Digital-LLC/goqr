/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary": "#e96d2b",
				"background-light": "#f8f6f6",
				"background-dark": "#211611",
			},
			fontFamily: {
				"display": ["Inter", "sans-serif"]
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/container-queries')
	],
};
