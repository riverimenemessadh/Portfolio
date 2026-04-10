import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Zpp from './Zpp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Zpp />
  </StrictMode>,
)
