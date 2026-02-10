/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          coral: '#FF6B6B',
          'coral-dark': '#E05555',
          turquoise: '#4ECDC4',
          'turquoise-dark': '#3BB5AD',
          yellow: '#FFE66D',
          'yellow-dark': '#E6CF5A',
          cream: '#FFFEF9',
          black: '#1A1A1A',
          ink: '#1A1A1A',
          white: '#FFFFFF',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F0',
            200: '#E0DDD5',
            300: '#CCCCCC',
            700: '#444444',
            800: '#2A2A2A',
            900: '#1A1A1A',
          },
        },
        // Semantic aliases
        success: '#4ECDC4',
        error: '#FF6B6B',
        warning: '#FFE66D',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 0 #1A1A1A',
        'brutal': '4px 4px 0 0 #1A1A1A',
        'brutal-md': '6px 6px 0 0 #1A1A1A',
        'brutal-lg': '8px 8px 0 0 #1A1A1A',
        'brutal-coral': '4px 4px 0 0 #FF6B6B',
        'brutal-turquoise': '4px 4px 0 0 #4ECDC4',
        'brutal-yellow': '4px 4px 0 0 #FFE66D',
      },
      borderWidth: {
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake': 'shake 0.4s ease-in-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9) translateY(20px)', opacity: '0' },
          '60%': { transform: 'scale(1.02) translateY(-4px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
