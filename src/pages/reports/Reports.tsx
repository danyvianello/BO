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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    IconButton,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridRowParams,
} from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { getReports, generateReport } from '../../services';
import { Report } from '../../types/api';
import { useUIStore } from '../../stores/uiStore';

interface ReportFormData {
    type: string;
    startDate: string;
    endDate: string;
    operatorId?: string;
    gameId?: string;
    currency?: string;
}

const Reports: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const { addNotification } = useUIStore();
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ReportFormData>({
        defaultValues: {
            type: 'transactions',
            startDate: '',
            endDate: '',
            operatorId: '',
            gameId: '',
            currency: '',
        },
    });

    const { data: reportsResponse, isLoading, refetch } = useQuery({
        queryKey: ['reports'],
        queryFn: () => getReports({}),
    });

    const generateMutation = useMutation({
        mutationFn: ({ type, params }: { type: string; params: any }) =>
            generateReport(type, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            addNotification('Reporte generado exitosamente', 'success');
            handleCloseDialog();
        },
        onError: () => {
            addNotification('Error al generar el reporte', 'error');
        },
    });

    const handleOpenDialog = () => {
        reset({
            type: 'transactions',
            startDate: '',
            endDate: '',
            operatorId: '',
            gameId: '',
            currency: '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        reset();
    };

    const handleSubmitForm = (data: ReportFormData) => {
        const { type, ...params } = data;
        generateMutation.mutate({ type, params });
    };

    const handleDownload = (report: Report) => {
        if (report.url) {
            window.open(report.url, '_blank');
        } else {
            addNotification('El reporte aún no está disponible para descarga', 'warning');
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
                return 'Completado';
            case 'failed':
                return 'Fallido';
            default:
                return status;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'transactions':
                return 'Transacciones';
            case 'sessions':
                return 'Sesiones';
            case 'revenue':
                return 'Ingresos';
            case 'games':
                return 'Juegos';
            case 'operators':
                return 'Operadores';
            default:
                return type;
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'type',
            headerName: 'Tipo',
            width: 150,
            renderCell: (params) => getTypeLabel(params.value),
        },
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
            field: 'startDate',
            headerName: 'Fecha Inicio',
            width: 150,
            renderCell: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: 'endDate',
            headerName: 'Fecha Fin',
            width: 150,
            renderCell: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: 'createdAt',
            headerName: 'Creado',
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
                    icon={<DownloadIcon />}
                    label="Descargar"
                    onClick={() => handleDownload(params.row)}
                    disabled={params.row.status !== 'completed'}
                />,
            ],
        },
    ];

    const reports = reportsResponse?.data?.data?.data || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Reportes
                </Typography>
                <Box display="flex" gap={1}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                    >
                        Generar Reporte
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

            {/* Tarjetas de resumen */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <AssessmentIcon color="primary" />
                                <Box>
                                    <Typography variant="h6">
                                        {reports.filter(r => r.status === 'completed').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Reportes Completados
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <AssessmentIcon color="warning" />
                                <Box>
                                    <Typography variant="h6">
                                        {reports.filter(r => r.status === 'pending').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Reportes Pendientes
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <AssessmentIcon color="error" />
                                <Box>
                                    <Typography variant="h6">
                                        {reports.filter(r => r.status === 'failed').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Reportes Fallidos
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <AssessmentIcon color="info" />
                                <Box>
                                    <Typography variant="h6">
                                        {reports.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Reportes
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <DataGrid
                        rows={reports}
                        columns={columns}
                        loading={isLoading}
                        autoHeight
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </CardContent>
            </Card>

            {/* Dialog para generar reporte */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Generar Nuevo Reporte</DialogTitle>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'El tipo es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Tipo de Reporte</InputLabel>
                                        <Select {...field} label="Tipo de Reporte">
                                            <MenuItem value="transactions">Transacciones</MenuItem>
                                            <MenuItem value="sessions">Sesiones</MenuItem>
                                            <MenuItem value="revenue">Ingresos</MenuItem>
                                            <MenuItem value="games">Juegos</MenuItem>
                                            <MenuItem value="operators">Operadores</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: 'La fecha de inicio es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Fecha de Inicio"
                                        type="date"
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                            <Controller
                                name="endDate"
                                control={control}
                                rules={{ required: 'La fecha de fin es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Fecha de Fin"
                                        type="date"
                                        error={!!errors.endDate}
                                        helperText={errors.endDate?.message}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                            <Controller
                                name="operatorId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="ID del Operador (Opcional)"
                                        fullWidth
                                        helperText="Dejar vacío para incluir todos los operadores"
                                    />
                                )}
                            />
                            <Controller
                                name="gameId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="ID del Juego (Opcional)"
                                        fullWidth
                                        helperText="Dejar vacío para incluir todos los juegos"
                                    />
                                )}
                            />
                            <Controller
                                name="currency"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Moneda (Opcional)"
                                        fullWidth
                                        helperText="Dejar vacío para incluir todas las monedas"
                                    />
                                )}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={generateMutation.isPending}
                        >
                            Generar Reporte
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Reports; 