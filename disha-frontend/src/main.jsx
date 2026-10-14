import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/styles/theme.css'
import '/src/styles/home.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
