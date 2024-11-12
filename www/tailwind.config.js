import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
        "./node_modules/flowbite/**/*.min.js",
        // "./node_modules/tw-elements/dist/js/**/*.js"
    ],

    theme: {
        extend: {
            // fontFamily: {
            //     sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            // },
            spacing: {
                '1/3': '33.333333%',
                '2/3': '66.666667%',
                '1/4': '25%',
                '2/4': '50%',
                '3/4': '75%',
                '1/5': '20%',
                '2/5': '40%',
                '3/5': '60%',
                '4/5': '80%',
            },
            // fontSize: {
            //     'sm': '0.8rem',
            //     'base': '1rem',
            //     'lg': '1.125rem',
            //     'xl': '1.25rem',
            //     '2xl': '1.563rem',
            //     '3xl': '1.953rem',
            //     '4xl': '2.441rem',
            //     '5xl': '3.052rem',
            // },
            fontSize: {
                '2xs': '10px',
                xs: '0.75rem',
                sm: '0.8rem',
                base: '1rem',
                md: '1.1rem',
                lg: '1.2rem',
                xl: '1.4rem',
                '2xl': '1.6rem',
                '3xl': '2.0rem',
                '4xl': '2.4rem',
                '5xl': '3.0rem',
            },
            borderWidth: {
                DEFAULT: '1px',
                base: '2.2px',
                '0': '0',
                '2': '2px',
                '3': '3px',
                '4': '4px',
                '6': '6px',
                '8': '8px',
            },
        },
        screens: {
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        }
    },

    plugins: [
        forms,
        require('flowbite/plugin'),
        // require("tw-elements/dist/plugin.cjs")
    ],
};
