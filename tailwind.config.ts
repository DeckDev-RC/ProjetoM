import type { Config } from "tailwindcss";

export default {
	darkMode: 'class',
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Nova paleta de cores atualizada
				pulse: {
					"50": "#e8f8ff",
					"100": "#d1f0ff",
					"200": "#a3e1ff",
					"300": "#75d2ff",
					"400": "#47c3ff",
					"500": "#2abfff", // Azul claro principal - #2ABFFF
					"600": "#2299cc",
					"700": "#1a7399",
					"800": "#114d66",
					"900": "#092633",
					"950": "#041319",
				},
				blurple: {
					"50": "#e9f3ff",
					"100": "#d3e7ff",
					"200": "#a7cfff",
					"300": "#7bb7ff",
					"400": "#4f9fff",
					"500": "#2b75d8", // Azul médio - #2B75D8
					"600": "#235eac",
					"700": "#1b4681",
					"800": "#122f56",
					"900": "#09172b",
					"950": "#040c15",
				},
				indigo: {
					"50": "#eeecf8",
					"100": "#ddd9f1",
					"200": "#bbb3e3",
					"300": "#998dd5",
					"400": "#7767c7",
					"500": "#524ebf", // Roxo médio - #524EBF
					"600": "#423e99",
					"700": "#312f73",
					"800": "#211f4d",
					"900": "#101026",
					"950": "#080813",
				},
				violet: {
					"50": "#ece9f6",
					"100": "#d9d3ed",
					"200": "#b3a7db",
					"300": "#8d7bc9",
					"400": "#674fb7",
					"500": "#4c30af", // Roxo escuro - #4C30AF
					"600": "#3d268c",
					"700": "#2e1d69",
					"800": "#1e1346",
					"900": "#0f0a23",
					"950": "#080511",
				},
				dark: {
					"50": "#f7f7f7",
					"100": "#e3e3e3",
					"200": "#c8c8c8",
					"300": "#a4a4a4",
					"400": "#818181",
					"500": "#666666",
					"600": "#515151",
					"700": "#434343",
					"800": "#383838",
					"900": "#000000", // Preto puro
					"950": "#000000",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				"float": {
					"0%": {
						transform: "translateY(0) scale(1.05)",
						boxShadow: "0 10px 15px rgba(124, 58, 237, 0.2)",
					},
					"25%": {
						transform: "translateY(-6px) scale(1.05)",
						boxShadow: "0 15px 20px rgba(124, 58, 237, 0.3)",
					},
					"50%": {
						transform: "translateY(-10px) scale(1.05)",
						boxShadow: "0 20px 25px rgba(124, 58, 237, 0.4)",
					},
					"75%": {
						transform: "translateY(-6px) scale(1.05)",
						boxShadow: "0 15px 20px rgba(124, 58, 237, 0.3)",
					},
					"100%": {
						transform: "translateY(0) scale(1.05)",
						boxShadow: "0 10px 15px rgba(124, 58, 237, 0.2)",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out forwards",
				'fade-in-right': 'fade-in-right 0.7s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.7s ease-out forwards',
				'pulse-slow': 'pulse-slow 3s infinite',
				"float": "float 2s cubic-bezier(0.4, 0, 0.2, 1) infinite"
			},
			backgroundImage: {
				'hero-gradient': 'linear-gradient(90deg, #2abfff 0%, #4c30af 100%)',
				'hero-gradient-2': 'linear-gradient(90deg, #2b75d8 0%, #4c30af 100%)',
				'pulse-gradient': 'linear-gradient(180deg, rgba(42,191,255,0.8) 0%, rgba(42,191,255,0) 100%)',
				'brand-gradient': 'linear-gradient(135deg, #2abfff 0%, #2b75d8 25%, #524ebf 75%, #4c30af 100%)',
				'dark-gradient': 'linear-gradient(135deg, #000000 0%, #2b75d8 50%, #4c30af 100%)',
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'display': ['Brockmann', 'SF Pro Display', 'Inter', 'sans-serif'],
				'brockmann': ['Brockmann', 'serif'],
				'playfair': ['"Playfair Display"', 'serif'],
			},
			boxShadow: {
				'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'elegant-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
