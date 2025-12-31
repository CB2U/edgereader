import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CompletionStep = ({ onNavigateToFeed }) => {
    useEffect(() => {
        // Auto-redirect after 2 seconds
        const timer = setTimeout(() => {
            onNavigateToFeed();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onNavigateToFeed]);

    return (
        <Fade in={true}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1, justifyContent: 'center' }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    You're all set!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    We're personalizing your feed...
                </Typography>
                <CircularProgress size={24} sx={{ mt: 2 }} />
            </Box>
        </Fade>
    );
};

export default CompletionStep;
