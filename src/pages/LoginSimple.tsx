import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Container,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

const LoginSimple: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { addNotification } = useUIStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            addNotification('Inicio de sesión exitoso', 'success');
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
            addNotification('Error al iniciar sesión', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Card sx={{ width: '100%', maxWidth: 400 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <Typography component="h1" variant="h4" gutterBottom>
                                RGS Backoffice
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Iniciar Sesión
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Usuario"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                variant="outlined"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Contraseña"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                variant="outlined"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading || !username || !password}
                                size="large"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                                <strong>Credenciales de prueba:</strong><br />
                                Usuario: admin<br />
                                Contraseña: admin123
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default LoginSimple; 