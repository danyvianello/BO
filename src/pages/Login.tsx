import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/api';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

interface LoginForm {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useUIStore();
    const { login: authLogin } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: LoginForm) => {
            await authLogin(data.username, data.password);
        },
        onSuccess: () => {
            addNotification('Inicio de sesión exitoso', 'success');
            navigate('/');
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al iniciar sesión', 'error');
        },
    });

    const onSubmit = (data: LoginForm) => {
        mutate(data);
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
                <Card sx={{ width: '100%' }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                Iniciar Sesión
                            </Typography>
                        </Box>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Usuario"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                {...register('username', {
                                    required: 'El usuario es requerido',
                                })}
                                error={!!errors.username}
                                helperText={errors.username?.message}
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
                                {...register('password', {
                                    required: 'La contraseña es requerida',
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isPending}
                            >
                                {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Login; 