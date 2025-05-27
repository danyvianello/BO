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
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getSessions, getSession } from '../../services';
import { Session } from '../../types/api';

const Sessions: React.FC = () => {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const { data: sessionsResponse, isLoading, refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: getSessions,
    });

    const handleViewSession = async (sessionId: string) => {
        try {
            const response = await getSession(sessionId);
            setSelectedSession(response.data.data);
            setDetailDialogOpen(true);
        } catch (error) {
            console.error('Error fetching session details:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'primary';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activa';
            case 'completed':
                return 'Completada';
            case 'cancelled':
                return 'Cancelada';
            default:
                return status;
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'userId', headerName: 'Usuario ID', width: 120 },
        { field: 'gameId', headerName: 'Juego ID', width: 120 },
        { field: 'operatorId', headerName: 'Operador ID', width: 120 },
        { field: 'currency', headerName: 'Moneda', width: 100 },
        {
            field: 'betAmount',
            headerName: 'Apuesta',
            width: 120,
            renderCell: (params) => `${params.value} ${params.row.currency}`,
        },
        {
            field: 'winAmount',
            headerName: 'Ganancia',
            width: 120,
            renderCell: (params) => `${params.value} ${params.row.currency}`,
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
            field: 'startTime',
            headerName: 'Inicio',
            width: 180,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: 'endTime',
            headerName: 'Fin',
            width: 180,
            renderCell: (params) =>
                params.value ? new Date(params.value).toLocaleString() : '-',
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
                    onClick={() => handleViewSession(params.row.id)}
                />,
            ],
        },
    ];

    const sessions = sessionsResponse?.data?.data?.data || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Sesiones de Juego
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => refetch()}
                >
                    Actualizar
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <DataGrid
                        rows={sessions}
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

            {/* Dialog de detalles de sesión */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Detalles de la Sesión</DialogTitle>
                <DialogContent>
                    {selectedSession && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Información General
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Typography>
                                            <strong>ID:</strong> {selectedSession.id}
                                        </Typography>
                                        <Typography>
                                            <strong>Estado:</strong>{' '}
                                            <Chip
                                                label={getStatusLabel(selectedSession.status)}
                                                color={getStatusColor(selectedSession.status)}
                                                size="small"
                                            />
                                        </Typography>
                                        <Typography>
                                            <strong>Usuario ID:</strong> {selectedSession.userId}
                                        </Typography>
                                        <Typography>
                                            <strong>Juego ID:</strong> {selectedSession.gameId}
                                        </Typography>
                                        <Typography>
                                            <strong>Operador ID:</strong> {selectedSession.operatorId}
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
                                            <strong>Moneda:</strong> {selectedSession.currency}
                                        </Typography>
                                        <Typography>
                                            <strong>Apuesta:</strong> {selectedSession.betAmount} {selectedSession.currency}
                                        </Typography>
                                        <Typography>
                                            <strong>Ganancia:</strong> {selectedSession.winAmount} {selectedSession.currency}
                                        </Typography>
                                        <Typography>
                                            <strong>Balance:</strong>{' '}
                                            <span style={{
                                                color: selectedSession.winAmount - selectedSession.betAmount >= 0 ? 'green' : 'red'
                                            }}>
                                                {(selectedSession.winAmount - selectedSession.betAmount).toFixed(2)} {selectedSession.currency}
                                            </span>
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Tiempos
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Typography>
                                            <strong>Inicio:</strong> {new Date(selectedSession.startTime).toLocaleString()}
                                        </Typography>
                                        {selectedSession.endTime && (
                                            <Typography>
                                                <strong>Fin:</strong> {new Date(selectedSession.endTime).toLocaleString()}
                                            </Typography>
                                        )}
                                        <Typography>
                                            <strong>Creado:</strong> {new Date(selectedSession.createdAt).toLocaleString()}
                                        </Typography>
                                        <Typography>
                                            <strong>Actualizado:</strong> {new Date(selectedSession.updatedAt).toLocaleString()}
                                        </Typography>
                                        {selectedSession.endTime && (
                                            <Typography>
                                                <strong>Duración:</strong>{' '}
                                                {Math.round(
                                                    (new Date(selectedSession.endTime).getTime() -
                                                        new Date(selectedSession.startTime).getTime()) / 1000 / 60
                                                )} minutos
                                            </Typography>
                                        )}
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

export default Sessions; 