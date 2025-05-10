import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
            }
        }
    },
    darkMode: 'class',
    plugins: [
        nextui({
            layout: {
                disabledOpacity: '0.3', // opacity-[0.3]
                radius: {
                    small: '2px', // rounded-small
                    medium: '4px', // rounded-medium
                    large: '6px' // rounded-large
                },
                borderWidth: {
                    small: '1px', // border-small
                    medium: '1px', // border-medium
                    large: '2px' // border-large
                }
            },
            themes: {
                light: {
                    colors: {
                        background: '#FFFFFF',
                        foreground: '#11181C',
                    //     primary: {
                    //         50: '#007BFF',
                    //         100: '#89DFF1',
                    //         200: '#C6FFF9',
                    //         300: '#6CC9FF',
                    //         400: '#007BFF',
                    //         500: '#007BFF',
                    //         600: '#28A745',
                    //         700: '#1DC1C9',
                    //         800: '#6CC9FF',
                    //         900: '#90CAF9',
                    //         DEFAULT: '#007BFF',
                    //         foreground: '#212B36'
                    //     },
                    //     info: {
                    //         50: '#0056B3',
                    //         100: '#007BFF',
                    //         200: '#6CC9FF',
                    //         300: '#90CAF9',
                    //         400: '#C3F0FF',
                    //         500: '#007BFF',
                    //         600: '#1DC1C9',
                    //         700: '#3FC7F5',
                    //         800: '#6CC9FF',
                    //         900: '#90CAF9',
                    //         DEFAULT: '#007BFF',
                    //         foreground: '#212B36'
                    //     },
                    //     danger: {
                    //         50: '#FF0000',
                    //         100: '#DC3545',
                    //         200: '#FF5722',
                    //         300: '#FF7F0E',
                    //         400: '#FFC107',
                    //         500: '#DC3545',
                    //         600: '#E64A19',
                    //         700: '#F26C25',
                    //         800: '#FF8A00',
                    //         900: '#FFC107',
                    //         DEFAULT: '#DC3545',
                    //         foreground: '#212B36'
                    //     },
                    //     secondary: {
                    //         50: '#6C757D',
                    //         100: '#898B94',
                    //         200: '#A6ACB2',
                    //         300: '#C2C7CD',
                    //         400: '#DBE2E8',
                    //         500: '#6C757D',
                    //         600: '#828994',
                    //         700: '#99A2AD',
                    //         800: '#B0B9C6',
                    //         900: '#C2C7CD',
                    //         DEFAULT: '#6C757D',
                    //         foreground: '#212B36'
                    //     },
                    //     success: {
                    //         50: '#4CAF50',
                    //         100: '#28A745',
                    //         200: '#66BB6A',
                    //         300: '#95CD77',
                    //         400: '#C5E1CE',
                    //         500: '#28A745',
                    //         600: '#2E7D38',
                    //         700: '#398E39',
                    //         800: '#56A55A',
                    //         900: '#73B778',
                    //         DEFAULT: '#28A745',
                    //         foreground: '#212B36'
                    //     },
                    //     warning: {
                    //         50: '#312107',
                    //         100: '#62420e',
                    //         200: '#936316',
                    //         300: '#c4841d',
                    //         400: '#f5a524',
                    //         500: '#f7b750',
                    //         600: '#f9c97c',
                    //         700: '#fbdba7',
                    //         800: '#fdedd3',
                    //         900: '#fefce8',
                    //         DEFAULT: '#f5a524',
                    //         foreground: '#212B36'
                    //     }
                    }
                },
                dark: {
                    colors: {
                        background: '#0D001A',
                        foreground: '#ffffff',
                        // primary: {
                        //     50: '#3B096C',
                        //     100: '#520F83',
                        //     200: '#7318A2',
                        //     300: '#9823C2',
                        //     400: '#c031e2',
                        //     500: '#DD62ED',
                        //     600: '#F182F6',
                        //     700: '#FCADF9',
                        //     800: '#FDD5F9',
                        //     900: '#FEECFE',
                        //     DEFAULT: '#DD62ED',
                        //     foreground: '#ffffff'
                        // },
                        // info: {
                        //     50: '#0056B3',
                        //     100: '#007BFF',
                        //     200: '#6CC9FF',
                        //     300: '#90CAF9',
                        //     400: '#C3F0FF',
                        //     500: '#007BFF',
                        //     600: '#1DC1C9',
                        //     700: '#3FC7F5',
                        //     800: '#6CC9FF',
                        //     900: '#90CAF9',
                        //     DEFAULT: '#007BFF',
                        //     foreground: '#ffffff'
                        // },
                        // danger: {
                        //     50: '#FF0000',
                        //     100: '#DC3545',
                        //     200: '#FF5722',
                        //     300: '#FF7F0E',
                        //     400: '#FFC107',
                        //     500: '#DC3545',
                        //     600: '#E64A19',
                        //     700: '#F26C25',
                        //     800: '#FF8A00',
                        //     900: '#FFC107',
                        //     DEFAULT: '#DC3545',
                        //     foreground: '#ffffff'
                        // },
                        // secondary: {
                        //     50: '#6C757D',
                        //     100: '#898B94',
                        //     200: '#A6ACB2',
                        //     300: '#C2C7CD',
                        //     400: '#DBE2E8',
                        //     500: '#6C757D',
                        //     600: '#828994',
                        //     700: '#99A2AD',
                        //     800: '#B0B9C6',
                        //     900: '#C2C7CD',
                        //     DEFAULT: '#6C757D',
                        //     foreground: '#ffffff'
                        // },
                        // success: {
                        //     50: '#4CAF50',
                        //     100: '#28A745',
                        //     200: '#66BB6A',
                        //     300: '#95CD77',
                        //     400: '#C5E1CE',
                        //     500: '#28A745',
                        //     600: '#2E7D38',
                        //     700: '#398E39',
                        //     800: '#56A55A',
                        //     900: '#73B778',
                        //     DEFAULT: '#28A745',
                        //     foreground: '#ffffff'
                        // },
                        // warning: {
                        //     50: '#312107',
                        //     100: '#62420e',
                        //     200: '#936316',
                        //     300: '#c4841d',
                        //     400: '#f5a524',
                        //     500: '#f7b750',
                        //     600: '#f9c97c',
                        //     700: '#fbdba7',
                        //     800: '#fdedd3',
                        //     900: '#fefce8',
                        //     DEFAULT: '#f5a524',
                        //     foreground: '#ffffff'
                        // }
                    }
                }
            }
        })
    ]
};
