import { Alert, Box } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';

/**
 * Component to display a banner when the app is offline.
 * @param {Object} props - Component props
 * @param {boolean} props.isOnline - Current connectivity status
 */
const OfflineIndicator = ({ isOnline }) => {
    if (isOnline) return null;

    return (
        <Box sx={{ width: '100%', position: 'sticky', top: 0, zIndex: 1100 }}>
            <Alert
                severity="warning"
                icon={<WifiOffIcon fontSize="inherit" />}
                sx={{
                    borderRadius: 0,
                    '& .MuiAlert-message': {
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: 500
                    }
                }}
            >
                Offline — Showing cached articles
            </Alert>
        </Box>
    );
};

export default OfflineIndicator;
