import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridRowParams,
} from '@mui/x-data-grid';
import {
    Visibility as ViewIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, getTransaction } from '../../services';
import { Transaction } from '../../types/api';

const Transactions: React.FC = () => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        currency: '',
        startDate: '',
        endDate: '',
    });

    const { data: transactionsResponse, isLoading, refetch } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => getTransactions(filters),
    });

    const handleViewTransaction = async (transactionId: string) => {
        try {
            const response = await getTransaction(transactionId);
            setSelectedTransaction(response.data.data);
            setDetailDialogOpen(true);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'bet':
                return 'warning';
            case 'win':
                return 'success';
            case 'refund':
                return 'info';
            default:
                return 'default';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'bet':
                return 'Apuesta';
            case 'win':
                return 'Ganancia';
            case 'refund':
                return 'Reembolso';
            default:
                return type;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'completed':
                return 'success';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'completed':
                return 'Completada';
            case 'failed':
                return 'Fallida';
            default:
                return status;
        }
    };

    const handleApplyFilters = () => {
        refetch();
        setFilterDialogOpen(false);
    };

    const handleClearFilters = () => {
        setFilters({
            type: '',
            status: '',
            currency: '',
            startDate: '',
            endDate: '',
        });
        setFilterDialogOpen(false);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'sessionId', headerName: 'Sesión ID', width: 120 },
        {
            field: 'type',
            headerName: 'Tipo',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={getTypeLabel(params.value)}
                    color={getTypeColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'amount',
            headerName: 'Monto',
            width: 120,
            renderCell: (params) => `${params.value} ${params.row.currency}`,
        },
        { field: 'currency', headerName: 'Moneda', width: 100 },
        {
            field: 'status',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={getStatusLabel(params.value)}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Fecha',
            width: 180,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 100,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<ViewIcon />}
                    label="Ver Detalles"
                    onClick={() => handleViewTransaction(params.row.id)}
                />,
            ],
        },
    ];

    const transactions = transactionsResponse?.data?.data?.data || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Transacciones
                </Typography>
                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => setFilterDialogOpen(true)}
                    >
                        Filtros
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => refetch()}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Box>

            <Card>
                <CardContent>
                    <DataGrid
                        rows={transactions}
                        columns={columns}
                        loading={isLoading}
                        autoHeight
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25, 50]}
                    />
                </CardContent>
            </Card>

            {/* Dialog de filtros */}
            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Filtros de Transacciones</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={filters.type}
                                label="Tipo"
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="bet">Apuesta</MenuItem>
                                <MenuItem value="win">Ganancia</MenuItem>
                                <MenuItem value="refund">Reembolso</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filters.status}
                                label="Estado"
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="pending">Pendiente</MenuItem>
                                <MenuItem value="completed">Completada</MenuItem>
                                <MenuItem value="failed">Fallida</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Moneda"
                            value={filters.currency}
                            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Fecha Inicio"
                            type="datetime-local"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Fecha Fin"
                            type="datetime-local"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClearFilters}>Limpiar</Button>
                    <Button onClick={() => setFilterDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleApplyFilters} variant="contained">Aplicar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de detalles de transacción */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Detalles de la Transacción</DialogTitle>
                <DialogContent>
                    {selectedTransaction && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Información General
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Typography>
                                            <strong>ID:</strong> {selectedTransaction.id}
                                        </Typography>
                                        <Typography>
                                            <strong>Sesión ID:</strong> {selectedTransaction.sessionId}
                                        </Typography>
                                        <Typography>
                                            <strong>Tipo:</strong>{' '}
                                            <Chip
                                                label={getTypeLabel(selectedTransaction.type)}
                                                color={getTypeColor(selectedTransaction.type)}
                                                size="small"
                                            />
                                        </Typography>
                                        <Typography>
                                            <strong>Estado:</strong>{' '}
                                            <Chip
                                                label={getStatusLabel(selectedTransaction.status)}
                                                color={getStatusColor(selectedTransaction.status)}
                                                size="small"
                                            />
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Información Financiera
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Typography>
                                            <strong>Monto:</strong> {selectedTransaction.amount} {selectedTransaction.currency}
                                        </Typography>
                                        <Typography>
                                            <strong>Moneda:</strong> {selectedTransaction.currency}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Fechas
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Typography>
                                            <strong>Creado:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}
                                        </Typography>
                                        <Typography>
                                            <strong>Actualizado:</strong> {new Date(selectedTransaction.updatedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Transactions; 