import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrencies, createCurrency } from '../services/api';

interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
    is_active: boolean;
}

export default function Currencies() {
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        symbol: '',
        exchange_rate: '',
    });
    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['currencies'],
        queryFn: getCurrencies,
    });

    const createCurrencyMutation = useMutation({
        mutationFn: createCurrency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencies'] });
            handleCloseDialog();
        },
        onError: (error: any) => {
            setError(error.response?.data?.detail || 'Error al crear moneda');
        },
    });

    const handleOpenDialog = () => {
        setFormData({
            code: '',
            name: '',
            symbol: '',
            exchange_rate: '',
        });
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            code: '',
            name: '',
            symbol: '',
            exchange_rate: '',
        });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCurrencyMutation.mutate({
            ...formData,
            exchange_rate: parseFloat(formData.exchange_rate),
        });
    };

    const columns: GridColDef[] = [
        { field: 'code', headerName: 'Código', width: 100 },
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'symbol', headerName: 'Símbolo', width: 100 },
        {
            field: 'exchange_rate',
            headerName: 'Tasa de cambio',
            width: 150,
            valueFormatter: (params) => params.value.toFixed(4),
        },
        {
            field: 'is_active',
            headerName: 'Estado',
            width: 100,
            valueGetter: (params) => (params.value ? 'Activo' : 'Inactivo'),
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Monedas</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Nueva Moneda
                </Button>
            </Box>

            <DataGrid
                rows={data || []}
                columns={columns}
                loading={isLoading}
                autoHeight
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Nueva Moneda</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            margin="dense"
                            label="Código"
                            fullWidth
                            required
                            value={formData.code}
                            onChange={(e) =>
                                setFormData({ ...formData, code: e.target.value.toUpperCase() })
                            }
                            helperText="Ejemplo: USD, EUR, MXN"
                        />
                        <TextField
                            margin="dense"
                            label="Nombre"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            helperText="Ejemplo: Dólar estadounidense"
                        />
                        <TextField
                            margin="dense"
                            label="Símbolo"
                            fullWidth
                            required
                            value={formData.symbol}
                            onChange={(e) =>
                                setFormData({ ...formData, symbol: e.target.value })
                            }
                            helperText="Ejemplo: $, €, ₱"
                        />
                        <TextField
                            margin="dense"
                            label="Tasa de cambio"
                            type="number"
                            fullWidth
                            required
                            value={formData.exchange_rate}
                            onChange={(e) =>
                                setFormData({ ...formData, exchange_rate: e.target.value })
                            }
                            helperText="Tasa de cambio respecto a USD"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained">
                            Crear
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
} 