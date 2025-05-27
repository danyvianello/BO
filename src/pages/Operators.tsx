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
import { getOperators, createOperator } from '../services/api';

interface Operator {
    id: string;
    name: string;
    api_key: string;
    status: string;
    default_currency: string;
}

export default function Operators() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        default_currency: '',
    });
    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['operators', page, pageSize],
        queryFn: () => getOperators(page + 1, pageSize),
    });

    const createOperatorMutation = useMutation({
        mutationFn: createOperator,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operators'] });
            handleCloseDialog();
        },
        onError: (error: any) => {
            setError(error.response?.data?.detail || 'Error al crear operador');
        },
    });

    const handleOpenDialog = () => {
        setFormData({
            name: '',
            default_currency: '',
        });
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: '',
            default_currency: '',
        });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createOperatorMutation.mutate(formData);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'api_key', headerName: 'API Key', width: 300 },
        { field: 'status', headerName: 'Estado', width: 120 },
        { field: 'default_currency', headerName: 'Moneda', width: 120 },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Operadores</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Nuevo Operador
                </Button>
            </Box>

            <DataGrid
                rows={data?.items || []}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                loading={isLoading}
                rowCount={data?.total || 0}
                paginationMode="server"
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Nuevo Operador</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            margin="dense"
                            label="Nombre"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Moneda por defecto"
                            fullWidth
                            required
                            value={formData.default_currency}
                            onChange={(e) =>
                                setFormData({ ...formData, default_currency: e.target.value })
                            }
                            helperText="Ejemplo: USD, EUR, MXN"
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