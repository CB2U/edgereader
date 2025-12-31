import React, { useState } from 'react';
import OnboardingFlow from './OnboardingFlow';

const OnboardingWrapper = ({ children }) => {
    // Initialize state directly from localStorage to prevent flicker
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
        return localStorage.getItem('hasCompletedOnboarding') === 'true';
    });

    const handleComplete = () => {
        // Flag is set in localStorage by OnboardingFlow, but we need to update state to re-render
        setHasCompletedOnboarding(true);
    };

    if (!hasCompletedOnboarding) {
        return <OnboardingFlow onComplete={handleComplete} />;
    }

    return <>{children}</>;
};

export default OnboardingWrapper;
