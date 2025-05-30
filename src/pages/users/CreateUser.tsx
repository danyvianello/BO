import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, getOperators } from '../../services/api';
import { User, Operator } from '../../types/api';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validators';
import { useUIStore } from '../../stores/uiStore';

interface CreateUserForm {
    username: string;
    email: string;
    password: string;
    role: User['role'];
    operator_id?: string;
}

const CreateUser: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useUIStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
    } = useForm<CreateUserForm>({
        defaultValues: {
            role: 'user',
            operator_id: 'system'
        }
    });

    const { data: operatorsResponse } = useQuery({
        queryKey: ['operators'],
        queryFn: getOperators,
    });

    const operators = operatorsResponse?.data?.data?.data || [];

    const { mutate, isLoading } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            addNotification('Usuario creado exitosamente', 'success');
            navigate('/users');
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al crear el usuario', 'error');
        },
    });

    const onSubmit = (data: CreateUserForm) => {
        mutate(data);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                        Crear Usuario
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Usuario"
                                    {...register('username', {
                                        required: 'El usuario es requerido',
                                        validate: (value) =>
                                            validateUsername(value) ||
                                            'El usuario debe tener al menos 4 caracteres y solo puede contener letras, números y guiones bajos',
                                    })}
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type="password"
                                    {...register('password', {
                                        required: 'La contraseña es requerida',
                                        validate: (value) =>
                                            validatePassword(value) ||
                                            'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
                                    })}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Rol"
                                    defaultValue="user"
                                    {...register('role', {
                                        required: 'El rol es requerido',
                                    })}
                                    error={!!errors.role}
                                    helperText={errors.role?.message}
                                >
                                    <MenuItem value="admin">Administrador</MenuItem>
                                    <MenuItem value="operator">Operador</MenuItem>
                                    <MenuItem value="user">Usuario</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Operador"
                                    defaultValue="system"
                                    {...register('operator_id', {
                                        required: 'El operador es requerido',
                                    })}
                                    error={!!errors.operator_id}
                                    helperText={errors.operator_id?.message}
                                >
                                    <MenuItem value="system">Sistema</MenuItem>
                                    {operators.map((operator: Operator) => (
                                        <MenuItem key={operator.id} value={operator.id}>
                                            {operator.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/users')}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isLoading}
                                    >
                                        Crear Usuario
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

export default CreateUser; 