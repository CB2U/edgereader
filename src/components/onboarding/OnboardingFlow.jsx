import React, { useState } from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel } from '@mui/material';
import WelcomeStep from './WelcomeStep';
import TopicSelectionStep from './TopicSelectionStep';
import SourceSelectionStep from './SourceSelectionStep';
import CompletionStep from './CompletionStep';
import { AVAILABLE_SOURCES } from '../../constants/onboarding';
import { savePreferences } from '../../services/storageService';

const steps = ['Welcome', 'Select Topics', 'Select Sources', 'Complete'];

const OnboardingFlow = ({ onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedTopics, setSelectedTopics] = useState(new Set());
    const [enabledSources, setEnabledSources] = useState(new Set(AVAILABLE_SOURCES));

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = async () => {
        try {
            // Calculate disabled sources (all available minus enabled)
            const disabledSources = new Set(
                AVAILABLE_SOURCES.filter(source => !enabledSources.has(source))
            );

            // Construct preferences object
            const prefs = {
                selectedTopics: selectedTopics,
                enabledSources: enabledSources,
                disabledSources: disabledSources,
                keywords: new Set()
            };

            // Save to IndexedDB
            await savePreferences(prefs);

            // Set flag in localStorage
            localStorage.setItem('hasCompletedOnboarding', 'true');

            // Move to Completion step
            handleNext();
        } catch (error) {
            console.error('Failed to save preferences:', error);
            // Simple error handling for MVP
            alert('Failed to save preferences. Please try again.');
        }
    };

    const handleFinalize = () => {
        onComplete();
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <WelcomeStep onNext={handleNext} />;
            case 1:
                return (
                    <TopicSelectionStep
                        onNext={handleNext}
                        selectedTopics={selectedTopics}
                        onToggleTopic={(topic) => {
                            const newTopics = new Set(selectedTopics);
                            if (newTopics.has(topic)) {
                                newTopics.delete(topic);
                            } else {
                                newTopics.add(topic);
                            }
                            setSelectedTopics(newTopics);
                        }}
                    />
                );
            case 2:
                return (
                    <SourceSelectionStep
                        onBack={handleBack}
                        onFinish={handleFinish}
                        enabledSources={enabledSources}
                        onToggleSource={(source) => {
                            const newSources = new Set(enabledSources);
                            if (newSources.has(source)) {
                                newSources.delete(source);
                            } else {
                                newSources.add(source);
                            }
                            setEnabledSources(newSources);
                        }}
                    />
                );
            case 3:
                return <CompletionStep onNavigateToFeed={handleFinalize} />;
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ mt: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {getStepContent(activeStep)}
                </Box>
            </Paper>
        </Container>
    );
};

export default OnboardingFlow;
