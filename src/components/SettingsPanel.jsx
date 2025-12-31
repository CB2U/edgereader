import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Divider,
    Paper
} from '@mui/material';
import * as Sentry from "@sentry/react";
import { loadPreferences, updatePreferences } from '../services/storageService';

/**
 * SettingsPanel component
 * Allows users to configure app preferences, including privacy-focused error reporting.
 */
const SettingsPanel = () => {
    const [prefs, setPrefs] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrefs = async () => {
            const storedPrefs = await loadPreferences();
            setPrefs(storedPrefs);
            setLoading(false);
        };
        fetchPrefs();
    }, []);

    const handleToggleErrorReporting = async (event) => {
        const enabled = event.target.checked;

        // 1. Update local state
        setPrefs(prev => ({ ...prev, errorReportingEnabled: enabled }));

        // 2. Persist to IndexedDB
        await updatePreferences({ errorReportingEnabled: enabled });

        // 3. Dynamically update Sentry client status
        const client = Sentry.getCurrentHub().getClient();
        if (client) {
            client.getOptions().enabled = enabled;
            console.log(`Sentry error reporting ${enabled ? 'ENABLED' : 'DISABLED'} dynamically.`);
        }
    };

    if (loading || !prefs) {
        return null;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Privacy & Stability
                </Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={prefs.errorReportingEnabled}
                                onChange={handleToggleErrorReporting}
                                color="primary"
                            />
                        }
                        label="Anonymous Error Reporting"
                    />
                    <FormHelperText sx={{ ml: 4 }}>
                        Help improve EdgeReader by sending anonymous crash reports. Only technical data is collected
                        (browser, OS, error details). No personal information, preferences, or browsing history is sent.
                    </FormHelperText>
                </FormGroup>
            </Paper>

            <Typography variant="body2" color="text.secondary">
                All other preferences (topics, sources, keywords) are managed via the onboarding flow or will be available in future updates.
            </Typography>
        </Box>
    );
};

export default SettingsPanel;
