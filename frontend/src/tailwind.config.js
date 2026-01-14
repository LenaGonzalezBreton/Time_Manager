/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                Login: {
                    light: '#bde0fe',
                    DEFAULT: '#007bff',
                    dark: '#004aad',
                },
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                logo: ['Raleway', 'sans-serif'],
            },
            borderRadius: {
                xl: '1rem',
            },
            boxShadow: {
                soft: '0 4px 20px rgba(0, 0, 0, 0.1)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.4s ease-in',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['hover', 'active', 'focus'],
            textColor: ['hover', 'active'],
            borderColor: ['hover', 'focus'],
            scale: ['hover', 'active'],
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
