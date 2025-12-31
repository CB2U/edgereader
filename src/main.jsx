import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initDatabase } from './services/articleStorage.js'

import OnboardingWrapper from './components/onboarding/OnboardingWrapper'

// Initialize IndexedDB before rendering app
initDatabase().catch(error => {
  console.error('Failed to initialize IndexedDB:', error);
  // Continue rendering app even if IndexedDB fails (graceful degradation)
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OnboardingWrapper>
      <App />
    </OnboardingWrapper>
  </StrictMode>,
)
// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}
