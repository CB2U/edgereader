import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initDatabase } from './services/articleStorage.js'
import { initSentry } from './config/sentryConfig.js'
import { loadPreferences } from './services/storageService.js'

import OnboardingWrapper from './components/onboarding/OnboardingWrapper'

// Initialize app services
const initializeApp = async () => {
  try {
    // 1. Initialize Database
    await initDatabase();

    // 2. Load Preferences and Initialize Sentry
    const prefs = await loadPreferences();
    initSentry(prefs.errorReportingEnabled);

    console.log('✅ Services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize app services:', error);
  }
};

initializeApp();

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
