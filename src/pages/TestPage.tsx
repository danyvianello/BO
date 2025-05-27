import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Card,
    CardContent,
    Alert,
} from '@mui/material';

const TestPage: React.FC = () => {
    const [clickCount, setClickCount] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleClick = () => {
        setClickCount(prev => prev + 1);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Página de Prueba - Interactividad
            </Typography>

            {showAlert && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    ¡Botón clickeado exitosamente!
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Test de Clicks
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Clicks realizados: {clickCount}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        sx={{ mr: 2 }}
                    >
                        Hacer Click
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setClickCount(0)}
                    >
                        Resetear
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Test de Input
                    </Typography>
                    <TextField
                        fullWidth
                        label="Escribe algo aquí"
                        value={inputValue}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="body1">
                        Texto ingresado: "{inputValue}"
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Información del Navegador
                    </Typography>
                    <Typography variant="body2">
                        User Agent: {navigator.userAgent}
                    </Typography>
                    <Typography variant="body2">
                        Touch Support: {('ontouchstart' in window) ? 'Sí' : 'No'}
                    </Typography>
                    <Typography variant="body2">
                        Viewport: {window.innerWidth} x {window.innerHeight}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TestPage; 