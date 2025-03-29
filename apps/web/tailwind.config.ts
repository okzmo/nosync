import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Instrument Sans', 'sans-serif'],
				serif: ['Vollkorn', 'serif'],
				code: ['Chivo Mono', 'sans-serif'],
				signature: ['Holimount', 'sans-serif']
			},
			colors: {
				accent: '#EE6930',
				zinc: {
					950: '#0A0A0A',
					925: '#131314',
					900: '#171718',
					50: '#F6F4EF'
				}
			},
			backgroundImage: {
				version: 'linear-gradient(90.48deg, #1D3E68 40.81%, #3674C3 71.67%, #9BBBE3 99.59%)'
			},
			boxShadow: {
				'accent-in-highlight':
					'inset 0px 0px 0px 1px rgba(250,250,250, 0.65), inset 0px 0px 16px rgba(250,250,250, 0.5)',
				'2xl-no-y': '0px 0px 50px 0px rgba(0, 0, 0, 0.35)'
			}
		}
	},

	plugins: [typography, forms]
} satisfies Config;
