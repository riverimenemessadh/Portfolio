import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Epp from './Epp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Epp />
  </StrictMode>,
)
