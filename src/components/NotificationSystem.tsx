import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { createPortal } from 'react-dom';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationSystemProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onClose }) => {
    const container = document.getElementById('notification-container');

    if (!container) return null;

    return createPortal(
        <>
            {notifications.map((notification) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => onClose(notification.id)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ mt: 2 }}
                >
                    <Alert
                        onClose={() => onClose(notification.id)}
                        severity={notification.type}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>,
        container
    );
};

export default NotificationSystem; 