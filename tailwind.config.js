/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"football-close": "url('/football_close.jpg')",
				"football-super-close": "url('/football_super_close.jpg')",
				"football-on-field": "url('/football_on_field.jpg')",
				"side-line": "url('/sideline.jpg')",
			},
		},
	},
	plugins: [],
};
