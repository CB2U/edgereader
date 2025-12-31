import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Switch, Fade, FormHelperText } from '@mui/material';
import { AVAILABLE_SOURCES } from '../../constants/onboarding';

const SourceSelectionStep = ({ onFinish, onBack, enabledSources, onToggleSource }) => {
    const isValid = enabledSources.size > 0;

    return (
        <Fade in={true}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Choose your sources
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Enable the sources you trust. Deselecting sources will hide their articles.
                </Typography>

                <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: '40vh', my: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <List dense>
                        {AVAILABLE_SOURCES.map((source) => {
                            const isEnabled = enabledSources.has(source);
                            return (
                                <ListItem key={source}>
                                    <ListItemText
                                        primary={source}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                    <Switch
                                        edge="end"
                                        onChange={() => onToggleSource(source)}
                                        checked={isEnabled}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                {!isValid && (
                    <FormHelperText error sx={{ fontSize: '0.9rem', mb: 2 }}>
                        Please enable at least 1 news source
                    </FormHelperText>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button onClick={onBack} size="large">
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onFinish}
                        disabled={!isValid}
                        size="large"
                    >
                        Finish
                    </Button>
                </Box>
            </Box>
        </Fade>
    );
};

export default SourceSelectionStep;
