import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silencia os alerts feios do navegador globalmente
window.alert = function(msg) {
  console.log("Aviso: ", msg);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
