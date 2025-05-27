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
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { getProviders, createProvider, updateProvider, deleteProvider } from '../../services';
import { Provider } from '../../types/api';
import { useUIStore } from '../../stores/uiStore';

interface ProviderFormData {
    name: string;
    code: string;
    status: 'active' | 'inactive';
    apiKey: string;
    apiSecret: string;
}

const Providers: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);

    const { addNotification } = useUIStore();
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ProviderFormData>({
        defaultValues: {
            name: '',
            code: '',
            status: 'active',
            apiKey: '',
            apiSecret: '',
        },
    });

    const { data: providersResponse, isLoading } = useQuery({
        queryKey: ['providers'],
        queryFn: getProviders,
    });

    const createMutation = useMutation({
        mutationFn: createProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providers'] });
            addNotification('Proveedor creado exitosamente', 'success');
            handleCloseDialog();
        },
        onError: () => {
            addNotification('Error al crear el proveedor', 'error');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Provider> }) =>
            updateProvider(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providers'] });
            addNotification('Proveedor actualizado exitosamente', 'success');
            handleCloseDialog();
        },
        onError: () => {
            addNotification('Error al actualizar el proveedor', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providers'] });
            addNotification('Proveedor eliminado exitosamente', 'success');
            setDeleteConfirmOpen(false);
            setProviderToDelete(null);
        },
        onError: () => {
            addNotification('Error al eliminar el proveedor', 'error');
        },
    });

    const handleOpenDialog = (provider?: Provider) => {
        if (provider) {
            setEditingProvider(provider);
            reset({
                name: provider.name,
                code: provider.code,
                status: provider.status,
                apiKey: provider.apiKey,
                apiSecret: provider.apiSecret,
            });
        } else {
            setEditingProvider(null);
            reset({
                name: '',
                code: '',
                status: 'active',
                apiKey: '',
                apiSecret: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProvider(null);
        reset();
    };

    const handleSubmitForm = (data: ProviderFormData) => {
        if (editingProvider) {
            updateMutation.mutate({ id: editingProvider.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteClick = (provider: Provider) => {
        setProviderToDelete(provider);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (providerToDelete) {
            deleteMutation.mutate(providerToDelete.id);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'code', headerName: 'Código', width: 150 },
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
        {
            field: 'apiKey',
            headerName: 'API Key',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {params.value ? `${params.value.substring(0, 8)}...` : ''}
                </Typography>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Fecha Creación',
            width: 180,
            renderCell: (params) => new Date(params.value).toLocaleDateString(),
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

    const providers = providersResponse?.data?.data?.data || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Gestión de Proveedores
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Proveedor
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <DataGrid
                        rows={providers}
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

            {/* Dialog para crear/editar proveedor */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
                                name="apiKey"
                                control={control}
                                rules={{ required: 'La API Key es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="API Key"
                                        error={!!errors.apiKey}
                                        helperText={errors.apiKey?.message}
                                        fullWidth
                                        type="password"
                                    />
                                )}
                            />
                            <Controller
                                name="apiSecret"
                                control={control}
                                rules={{ required: 'El API Secret es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="API Secret"
                                        error={!!errors.apiSecret}
                                        helperText={errors.apiSecret?.message}
                                        fullWidth
                                        type="password"
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
                            {editingProvider ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmación para eliminar */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar el proveedor "{providerToDelete?.name}"?
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

export default Providers; 