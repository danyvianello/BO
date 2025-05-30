import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../services/api';
import { User } from '../../types/api';
import { formatDate, formatRole, formatStatus } from '../../utils/formatters';
import { useUIStore } from '../../stores/uiStore';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useUIStore();
    const queryClient = useQueryClient();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            addNotification('Usuario eliminado exitosamente', 'success');
            setDeleteConfirmOpen(false);
            setUserToDelete(null);
        },
        onError: (error: any) => {
            addNotification(error.message || 'Error al eliminar el usuario', 'error');
        },
    });

    const columns: GridColDef[] = [
        { field: 'username', headerName: 'Usuario', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'role',
            headerName: 'Rol',
            flex: 1,
            valueGetter: (params) => formatRole(params.row.role),
        },
        {
            field: 'status',
            headerName: 'Estado',
            flex: 1,
            valueGetter: (params) => formatStatus(params.row.status),
        },
        {
            field: 'created_at',
            headerName: 'Fecha de Creación',
            flex: 1,
            valueGetter: (params) => formatDate(params.row.created_at || params.row.createdAt),
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
                            onClick={() => navigate(`/users/edit/${params.row._id || params.row.id}`)}
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton
                            onClick={() => handleDeleteClick(params.row)}
                            size="small"
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteMutation.mutate(userToDelete._id || userToDelete.id);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Usuarios
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/users/create')}
                        >
                            Crear Usuario
                        </Button>
                    </Box>
                    <DataGrid
                        rows={usersResponse?.data?.data?.data || []}
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

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    ¿Está seguro que desea eliminar el usuario {userToDelete?.username}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Users; 