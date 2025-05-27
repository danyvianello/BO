import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface FormContainerProps {
    title: string;
    children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>
                {children}
            </Paper>
        </Box>
    );
};

export default FormContainer; 