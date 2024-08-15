import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
       typography: {
        DEFAULT: {
          css: {
            'pre': {
              backgroundColor: '#f5f5f5',
              borderRadius: '0.375rem',
              padding: '1rem',
              overflowX: 'auto',
            },
            'code': {
              color: '#d73a49', // Change to your preferred color
              backgroundColor: '#f1f1f1', // Background color of inline code
              padding: '0.2rem 0.4rem',
              borderRadius: '0.2rem',
            },
            'code[class*="language-"]': {
              display: 'block',
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              backgroundColor: '#2d2d2d', // Background color for code block
              color: '#f8f8f2', // Text color for code block
              borderRadius: '0.375rem',
              border: '1px solid #333',
            },
            'pre[class*="language-"]': {
              backgroundColor: '#2d2d2d', // Background color for code block
              color: '#f8f8f2', // Text color for code block
              borderRadius: '0.375rem',
              border: '1px solid #333',
              overflowX: 'auto',
            },
          },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
               "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        slide: {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
    shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
           meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)",},
       
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
        
           }},
      },
      animation: {
                "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        slide: "slide var(--speed) ease-in-out infinite alternate",
      
         meteor: "meteor 5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 8s infinite",
    
      },
      
    },
  },
  plugins: [require("tailwindcss-animate") , require('@tailwindcss/typography')],
} satisfies Config

export default config