import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import QuizeQuestion from './assets/QuizeQuestions.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuizeQuestion/>
  </StrictMode>
)
