import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

const WelcomeStep = ({ onNext }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1, justifyContent: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary.main" fontWeight="bold">
                EdgeReader
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                Welcome to your private news reader.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ maxWidth: 500, mb: 4 }}>
                Personalized news, stored entirely on your device. We never track you or send your data to the cloud.
                Let's set up your feed.
            </Typography>
            <Button
                variant="contained"
                size="large"
                onClick={onNext}
                sx={{ minWidth: 200, borderRadius: 8, py: 1.5, fontSize: '1.1rem' }}
            >
                Get Started
            </Button>
        </Box>
    );
};

export default WelcomeStep;
