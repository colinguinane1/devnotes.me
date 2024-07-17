import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
         colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: {dark: '#2D2D2D ', DEFAULT: '#2D3748', light: '#FFFFFF'},
      secondary: {dark: '#FFFFFF', DEFAULT: '#4299E1', light: '#363636 '},
  
    },
    },
  },
  plugins: [],
};
export default config;
