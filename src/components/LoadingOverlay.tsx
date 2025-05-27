import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
    const container = document.getElementById('loading-container');

    if (!container) return null;

    return createPortal(
        <Box
            sx={{
                display: isLoading ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 9999,
                pointerEvents: isLoading ? 'auto' : 'none',
            }}
        >
            <CircularProgress size={60} thickness={4} />
            {message && (
                <Box sx={{ mt: 2, color: 'text.secondary' }}>
                    {message}
                </Box>
            )}
        </Box>,
        container
    );
};

export default LoadingOverlay; 