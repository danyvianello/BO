import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridRowParams,
} from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { getGames, createGame, updateGame, deleteGame } from '../../services/api';
import { Game } from '../../types/api';
import { useUIStore } from '../../stores/uiStore';
import { formatDate } from '../../utils/formatters';

interface GameFormData {
    name: string;
    provider: string;
    type: string;
    status: 'active' | 'inactive';
    description?: string;
    thumbnail_url?: string;
    rtp?: number;
    min_bet?: number;
    max_bet?: number;
    currency?: string;
    is_active?: boolean;
}

const Games: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

    const { addNotification } = useUIStore();
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<GameFormData>({
        defaultValues: {
            name: '',
            provider: '',
            type: 'slot',
            status: 'active',
            description: '',
            thumbnail_url: '',
            rtp: 0.90,
            min_bet: 0.01,
            max_bet: 1000,
            currency: 'USD',
            is_active: true
        },
    });

    const { data: gamesResponse, isLoading } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    const createMutation = useMutation({
        mutationFn: createGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            addNotification('Juego creado exitosamente', 'success');
            handleCloseDialog();
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al crear el juego', 'error');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Game> }) =>
            updateGame(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            addNotification('Juego actualizado exitosamente', 'success');
            handleCloseDialog();
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al actualizar el juego', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            addNotification('Juego eliminado exitosamente', 'success');
            setDeleteConfirmOpen(false);
            setGameToDelete(null);
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al eliminar el juego', 'error');
        },
    });

    const handleOpenDialog = (game?: Game) => {
        if (game) {
            setEditingGame(game);
            reset({
                name: game.name,
                provider: game.provider,
                type: game.type,
                status: game.status,
                description: game.description,
                thumbnail_url: game.thumbnail_url,
                rtp: game.rtp,
                min_bet: game.min_bet,
                max_bet: game.max_bet,
                currency: game.currency,
                is_active: game.is_active
            });
        } else {
            setEditingGame(null);
            reset({
                name: '',
                provider: '',
                type: 'slot',
                status: 'active',
                description: '',
                thumbnail_url: '',
                rtp: 0.90,
                min_bet: 0.01,
                max_bet: 1000,
                currency: 'USD',
                is_active: true
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingGame(null);
        reset();
    };

    const handleSubmitForm = (data: GameFormData) => {
        if (editingGame) {
            updateMutation.mutate({ id: editingGame._id || editingGame.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteClick = (game: Game) => {
        setGameToDelete(game);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (gameToDelete) {
            deleteMutation.mutate(gameToDelete._id);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'provider', headerName: 'Proveedor', width: 150 },
        { field: 'type', headerName: 'Tipo', width: 120 },
        {
            field: 'status',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'active' ? 'Activo' : 'Inactivo'}
                    color={params.value === 'active' ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
        { field: 'min_bet', headerName: 'Apuesta Mín.', width: 120 },
        { field: 'max_bet', headerName: 'Apuesta Máx.', width: 120 },
        {
            field: 'created_at',
            headerName: 'Fecha de Creación',
            width: 180,
            valueGetter: (params) => formatDate(params.row.created_at || params.row.createdAt),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 120,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Editar"
                    onClick={() => handleOpenDialog(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Eliminar"
                    onClick={() => handleDeleteClick(params.row)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Juegos
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Crear Juego
                        </Button>
                    </Box>
                    <DataGrid
                        rows={gamesResponse?.data?.data?.data || []}
                        columns={columns}
                        loading={isLoading}
                        autoHeight
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        getRowId={(row) => row._id || row.id}
                        disableRowSelectionOnClick
                    />
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGame ? 'Editar Juego' : 'Nuevo Juego'}
                </DialogTitle>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'El nombre es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="provider"
                                control={control}
                                rules={{ required: 'El proveedor es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Proveedor"
                                        error={!!errors.provider}
                                        helperText={errors.provider?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'El tipo es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Tipo"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                    >
                                        <MenuItem value="slot">Slot</MenuItem>
                                        <MenuItem value="table">Mesa</MenuItem>
                                        <MenuItem value="live">Live</MenuItem>
                                        <MenuItem value="lottery">Lotería/Raspadita</MenuItem>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'El estado es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Estado"
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
                                    >
                                        <MenuItem value="active">Activo</MenuItem>
                                        <MenuItem value="inactive">Inactivo</MenuItem>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        multiline
                                        rows={3}
                                    />
                                )}
                            />
                            <Controller
                                name="thumbnail_url"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="URL de la imagen"
                                    />
                                )}
                            />
                            <Controller
                                name="rtp"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="RTP"
                                        type="number"
                                        inputProps={{ step: 0.01, min: 0, max: 1 }}
                                    />
                                )}
                            />
                            <Controller
                                name="min_bet"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apuesta Mínima"
                                        type="number"
                                        inputProps={{ step: 0.01, min: 0 }}
                                    />
                                )}
                            />
                            <Controller
                                name="max_bet"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apuesta Máxima"
                                        type="number"
                                        inputProps={{ step: 0.01, min: 0 }}
                                    />
                                )}
                            />
                            <Controller
                                name="currency"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Moneda"
                                    />
                                )}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained">
                            {editingGame ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar el juego "{gameToDelete?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Games; 