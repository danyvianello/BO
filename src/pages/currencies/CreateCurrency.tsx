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
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createCurrency } from '../../services/api';
import { Currency } from '../../types/api';
import { useUIStore } from '../../stores/uiStore';

interface CreateCurrencyForm {
    code: string;
    name: string;
    symbol: string;
    is_active: boolean;
}

const CreateCurrency: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useUIStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CreateCurrencyForm>({
        defaultValues: {
            is_active: true,
        },
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: createCurrency,
        onSuccess: () => {
            addNotification('Moneda creada exitosamente', 'success');
            navigate('/currencies');
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al crear la moneda', 'error');
        },
    });

    const onSubmit = (data: CreateCurrencyForm) => {
        mutate(data);
    };

    const isActive = watch('is_active');

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                        Crear Moneda
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Código"
                                    {...register('code', {
                                        required: 'El código es requerido',
                                        pattern: {
                                            value: /^[A-Z]{3}$/,
                                            message: 'El código debe ser de 3 letras mayúsculas',
                                        },
                                    })}
                                    error={!!errors.code}
                                    helperText={errors.code?.message}
                                />
                            </Grid>
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
                                    label="Símbolo"
                                    {...register('symbol', {
                                        required: 'El símbolo es requerido',
                                        maxLength: {
                                            value: 5,
                                            message: 'El símbolo no puede tener más de 5 caracteres',
                                        },
                                    })}
                                    error={!!errors.symbol}
                                    helperText={errors.symbol?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isActive}
                                            onChange={(e) =>
                                                setValue('is_active', e.target.checked)
                                            }
                                            color="primary"
                                        />
                                    }
                                    label="Activa"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/currencies')}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isLoading}
                                    >
                                        Crear Moneda
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

export default CreateCurrency; 