/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
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
				'credit-royal': '#00205B',
				'credit-gold': '#C5B358',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'grid-flow': 'grid-flow 20s linear infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
				'spin-ultra-slow': 'spin 60s linear infinite',
				'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				shimmer: {
					from: {
						backgroundPosition: '0 0'
					},
					to: {
						backgroundPosition: '-200% 0'
					}
				},
				'grid-flow': {
					'0%': {
						transform: 'perspective(1000px) rotateX(60deg) translateY(0)'
					},
					'100%': {
						transform: 'perspective(1000px) rotateX(60deg) translateY(40px)'
					}
				},
				'scroll-left': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'float-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'50%': { opacity: '0.8' },
					'100%': { transform: 'translateY(-100%)', opacity: '0' }
				},
				'rise': {
					'0%': { transform: 'translateY(100%) scale(1)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-100vh) scale(0)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'grid-flow': 'grid-flow 20s linear infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
				'spin-ultra-slow': 'spin 60s linear infinite',
				'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'scroll-left': 'scroll-left 30s linear infinite',
				'float-up': 'float-up 15s linear infinite',
				'rise': 'rise 10s ease-out infinite',
				'scan': 'scan 3s linear infinite',
				'pulse-2s': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			fontFamily: {
				sans: [
					'Inter',
					'sans-serif'
				],
				heading: [
					'Outfit',
					'Inter',
					'sans-serif'
				]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
