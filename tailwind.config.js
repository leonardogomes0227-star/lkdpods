// tailwind.config.js — adicione dentro de theme.extend, ao lado de colors/fontFamily
keyframes: {
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-18px)' },
  },
  floatSlow: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-28px)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  fadeUp: {
    '0%': { opacity: '0', transform: 'translateY(24px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
},
animation: {
  float: 'float 6s ease-in-out infinite',
  floatSlow: 'floatSlow 9s ease-in-out infinite',
  shimmer: 'shimmer 3s linear infinite',
  fadeUp: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
},
