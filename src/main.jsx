import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="app">
      <h1>ChambaApp v2</h1>
      <p>Frontend en React funcionando correctamente.</p>
    </main>
  </StrictMode>,
)
