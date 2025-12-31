import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Component for the manual refresh button.
 * @param {Object} props - Component props
 * @param {function} props.onRefresh - Function to call on click
 * @param {boolean} props.isLoading - Whether a refresh is in progress
 * @param {boolean} props.isOnline - Current connectivity status
 */
const RefreshButton = ({ onRefresh, isLoading, isOnline }) => {
    return (
        <Tooltip title={isOnline ? "Refresh feed" : "Cannot refresh while offline"}>
            <span>
                <IconButton
                    onClick={onRefresh}
                    disabled={isLoading || !isOnline}
                    color="inherit"
                    aria-label="refresh feed"
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        <RefreshIcon />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default RefreshButton;
