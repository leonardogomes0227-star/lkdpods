// dentro de keyframes, adicione:
flipDown: {
  '0%': { transform: 'rotateX(0deg)' },
  '45%': { transform: 'rotateX(-90deg)' },
  '55%': { transform: 'rotateX(90deg)' },
  '100%': { transform: 'rotateX(0deg)' },
},
sweep: {
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(250%)' },
},

// dentro de animation, adicione:
flipDown: 'flipDown 0.5s ease-in-out',
sweep: 'sweep 3.5s ease-in-out infinite',
