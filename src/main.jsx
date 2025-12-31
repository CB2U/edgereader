import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import OnboardingWrapper from './components/onboarding/OnboardingWrapper'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OnboardingWrapper>
      <App />
    </OnboardingWrapper>
  </StrictMode>,
)
