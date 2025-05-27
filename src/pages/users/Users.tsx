import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/api';
import { User } from '../../types/api';
import { formatDate, formatRole, formatStatus } from '../../utils/formatters';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
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
                            onClick={() => navigate(`/users/edit/${params.row.id}`)}
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton
                            onClick={() => handleDelete(params.row.id)}
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

    const handleDelete = async (id: string) => {
        // TODO: Implementar lógica de eliminación
        console.log('Eliminar usuario:', id);
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
                        rows={usersResponse?.data.data || []}
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

export default Users; 