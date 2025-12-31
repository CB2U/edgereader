import React from 'react';
import { Box, Typography, Button, Chip, FormHelperText, Fade } from '@mui/material';
import { AVAILABLE_TOPICS } from '../../constants/onboarding';
import CheckIcon from '@mui/icons-material/Check';

const TopicSelectionStep = ({ onNext, selectedTopics, onToggleTopic }) => {
    const minTopics = 3;
    const isValid = selectedTopics.size >= minTopics;

    return (
        <Fade in={true}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    What interests you?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Select at least {minTopics} topics to personalize your feed.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 4 }}>
                    {AVAILABLE_TOPICS.map((topic) => {
                        const isSelected = selectedTopics.has(topic);
                        return (
                            <Chip
                                key={topic}
                                label={topic}
                                onClick={() => onToggleTopic(topic)}
                                color={isSelected ? "primary" : "default"}
                                variant={isSelected ? "filled" : "outlined"}
                                icon={isSelected ? <CheckIcon /> : undefined}
                                sx={{
                                    borderRadius: 2,
                                    px: 1,
                                    py: 2.5,
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                                    }
                                }}
                            />
                        );
                    })}
                </Box>

                {!isValid && (
                    <FormHelperText error sx={{ fontSize: '0.9rem', mb: 2 }}>
                        Please select {minTopics - selectedTopics.size} more {minTopics - selectedTopics.size === 1 ? 'topic' : 'topics'}
                    </FormHelperText>
                )}

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={onNext}
                        disabled={!isValid}
                        size="large"
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Fade>
    );
};

export default TopicSelectionStep;
