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
import { getGames, createGame, updateGame, deleteGame } from '../../services';
import { Game } from '../../types/api';
import { useUIStore } from '../../stores/uiStore';

interface GameFormData {
    name: string;
    code: string;
    provider: string;
    type: string;
    status: 'active' | 'inactive';
    minBet: number;
    maxBet: number;
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
            code: '',
            provider: '',
            type: 'slot',
            status: 'active',
            minBet: 0.01,
            maxBet: 1000,
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
        onError: () => {
            addNotification('Error al crear el juego', 'error');
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
        onError: () => {
            addNotification('Error al actualizar el juego', 'error');
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
        onError: () => {
            addNotification('Error al eliminar el juego', 'error');
        },
    });

    const handleOpenDialog = (game?: Game) => {
        if (game) {
            setEditingGame(game);
            reset({
                name: game.name,
                code: game.code,
                provider: game.provider,
                type: game.type,
                status: game.status,
                minBet: game.minBet,
                maxBet: game.maxBet,
            });
        } else {
            setEditingGame(null);
            reset({
                name: '',
                code: '',
                provider: '',
                type: 'slot',
                status: 'active',
                minBet: 0.01,
                maxBet: 1000,
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
            updateMutation.mutate({ id: editingGame.id, data });
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
            deleteMutation.mutate(gameToDelete.id);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'code', headerName: 'Código', width: 150 },
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
        { field: 'minBet', headerName: 'Apuesta Mín.', width: 120 },
        { field: 'maxBet', headerName: 'Apuesta Máx.', width: 120 },
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

    const games = gamesResponse?.data?.data?.data || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Gestión de Juegos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Juego
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <DataGrid
                        rows={games}
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

            {/* Dialog para crear/editar juego */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGame ? 'Editar Juego' : 'Nuevo Juego'}
                </DialogTitle>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
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
                                        fullWidth
                                    />
                                )}
                            />
                            <Controller
                                name="code"
                                control={control}
                                rules={{ required: 'El código es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Código"
                                        error={!!errors.code}
                                        helperText={errors.code?.message}
                                        fullWidth
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
                                        fullWidth
                                    />
                                )}
                            />
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Tipo</InputLabel>
                                        <Select {...field} label="Tipo">
                                            <MenuItem value="slot">Slot</MenuItem>
                                            <MenuItem value="table">Mesa</MenuItem>
                                            <MenuItem value="live">En Vivo</MenuItem>
                                            <MenuItem value="lottery">Lotería</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Estado</InputLabel>
                                        <Select {...field} label="Estado">
                                            <MenuItem value="active">Activo</MenuItem>
                                            <MenuItem value="inactive">Inactivo</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="minBet"
                                control={control}
                                rules={{
                                    required: 'La apuesta mínima es requerida',
                                    min: { value: 0.01, message: 'Debe ser mayor a 0' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apuesta Mínima"
                                        type="number"
                                        error={!!errors.minBet}
                                        helperText={errors.minBet?.message}
                                        fullWidth
                                        inputProps={{ step: 0.01 }}
                                    />
                                )}
                            />
                            <Controller
                                name="maxBet"
                                control={control}
                                rules={{
                                    required: 'La apuesta máxima es requerida',
                                    min: { value: 0.01, message: 'Debe ser mayor a 0' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apuesta Máxima"
                                        type="number"
                                        error={!!errors.maxBet}
                                        helperText={errors.maxBet?.message}
                                        fullWidth
                                        inputProps={{ step: 0.01 }}
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
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingGame ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmación para eliminar */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar el juego "{gameToDelete?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isPending}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Games; 