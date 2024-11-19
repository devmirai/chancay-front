import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Embarcaciones from './pages/Embarcaciones.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Embarcaciones />
  </StrictMode>,
)
