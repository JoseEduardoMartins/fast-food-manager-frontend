import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/vaul.css'
import '@styles/main.css'
import { Router } from '@pages/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
