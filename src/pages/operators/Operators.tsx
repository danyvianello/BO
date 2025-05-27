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
import { getOperators } from '../../services/api';
import { Operator } from '../../types/api';
import { formatDate, formatStatus } from '../../utils/formatters';

const Operators: React.FC = () => {
    const navigate = useNavigate();
    const { data: operatorsResponse, isLoading } = useQuery({
        queryKey: ['operators'],
        queryFn: getOperators,
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', flex: 1 },
        { field: 'code', headerName: 'Código', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
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
                            onClick={() => navigate(`/operators/edit/${params.row.id}`)}
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
        console.log('Eliminar operador:', id);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Operadores
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/operators/create')}
                        >
                            Crear Operador
                        </Button>
                    </Box>
                    <DataGrid
                        rows={operatorsResponse?.data.data || []}
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

export default Operators; 