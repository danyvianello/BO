import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createOperator } from '../../services/api';
import { Operator } from '../../types/api';
import { validateEmail } from '../../utils/validators';
import { useUIStore } from '../../stores/uiStore';

interface CreateOperatorForm {
    name: string;
    code: string;
    email: string;
    description: string;
}

const CreateOperator: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useUIStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateOperatorForm>();

    const { mutate, isLoading } = useMutation({
        mutationFn: createOperator,
        onSuccess: () => {
            addNotification('Operador creado exitosamente', 'success');
            navigate('/operators');
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al crear el operador', 'error');
        },
    });

    const onSubmit = (data: CreateOperatorForm) => {
        mutate(data);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                        Crear Operador
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    {...register('name', {
                                        required: 'El nombre es requerido',
                                        minLength: {
                                            value: 3,
                                            message: 'El nombre debe tener al menos 3 caracteres',
                                        },
                                    })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Código"
                                    {...register('code', {
                                        required: 'El código es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9_]+$/,
                                            message: 'El código solo puede contener letras mayúsculas, números y guiones bajos',
                                        },
                                    })}
                                    error={!!errors.code}
                                    helperText={errors.code?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    {...register('email', {
                                        required: 'El email es requerido',
                                        validate: (value) =>
                                            validateEmail(value) || 'El email no es válido',
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                    {...register('description', {
                                        required: 'La descripción es requerida',
                                    })}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/operators')}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isLoading}
                                    >
                                        Crear Operador
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateOperator; 