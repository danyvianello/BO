import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Switch,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrencies, updateCurrency } from '../../services/api';
import { Currency } from '../../types/api';
import { formatDate } from '../../utils/formatters';
import { useUIStore } from '../../stores/uiStore';

const Currencies: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addNotification } = useUIStore();
    const { data: currenciesResponse, isLoading } = useQuery({
        queryKey: ['currencies'],
        queryFn: getCurrencies,
    });

    const updateCurrencyMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Currency> }) =>
            updateCurrency(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencies'] });
            addNotification('Moneda actualizada exitosamente', 'success');
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al actualizar la moneda', 'error');
        },
    });

    const handleStatusChange = (id: string, currentStatus: boolean) => {
        updateCurrencyMutation.mutate({
            id,
            data: { is_active: !currentStatus },
        });
    };

    const columns: GridColDef[] = [
        { field: 'code', headerName: 'Código', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 1 },
        { field: 'symbol', headerName: 'Símbolo', flex: 1 },
        {
            field: 'is_active',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params) => (
                <Switch
                    checked={params.row.is_active}
                    onChange={() => handleStatusChange(params.row.id, params.row.is_active)}
                    color="primary"
                />
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Fecha de Creación',
            flex: 1,
            valueGetter: (params) => formatDate(params.row.createdAt),
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Editar">
                        <IconButton
                            onClick={() => navigate(`/currencies/edit/${params.row.id}`)}
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Monedas
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/currencies/create')}
                        >
                            Crear Moneda
                        </Button>
                    </Box>
                    <DataGrid
                        rows={currenciesResponse?.data.data || []}
                        columns={columns}
                        loading={isLoading}
                        autoHeight
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        disableRowSelectionOnClick
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default Currencies; 