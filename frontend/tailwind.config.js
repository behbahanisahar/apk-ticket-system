export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214 32% 91%)',
        input: 'hsl(214 32% 91%)',
        ring: 'hsl(357 85% 52%)',
        primary: {
          DEFAULT: '#ED1E23',
          foreground: '#ffffff',
          light: '#f24a4e',
          dark: '#c4181c',
        },
        secondary: {
          DEFAULT: '#54595F',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Vazir', 'Tahoma', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0,0,0,0.1), 0 2px 10px -2px rgba(0,0,0,0.04)',
        'glow': '0 0 40px -10px rgba(237,30,35,0.3)',
        'card': '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 20px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
