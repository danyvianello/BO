import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    IconButton,
    Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUsers,
    createUser,
    updateUser,
    getUserWallet,
    updateWalletBalance,
    adjustWalletBalance,
    getWalletReconciliation,
} from '../services/api';

interface User {
    id: string;
    email: string;
    username: string;
    full_name: string;
    operator_id: string;
    wallet?: {
        balance: number;
        currency: string;
    };
}

export default function Users() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openWalletDialog, setOpenWalletDialog] = useState(false);
    const [openAdjustDialog, setOpenAdjustDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        password: '',
    });
    const [walletAmount, setWalletAmount] = useState('');
    const [adjustAmount, setAdjustAmount] = useState('');
    const [adjustReason, setAdjustReason] = useState('');
    const [adjustError, setAdjustError] = useState('');
    const [adjustLoading, setAdjustLoading] = useState(false);
    const [walletRecon, setWalletRecon] = useState<any>(null);
    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['users', page, pageSize],
        queryFn: () => getUsers(page + 1, pageSize),
    });

    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseDialog();
        },
        onError: (error: any) => {
            setError(error.response?.data?.detail || 'Error al crear usuario');
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseDialog();
        },
        onError: (error: any) => {
            setError(error.response?.data?.detail || 'Error al actualizar usuario');
        },
    });

    const updateWalletMutation = useMutation({
        mutationFn: ({ userId, amount }: { userId: string; amount: number }) =>
            updateWalletBalance(userId, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseWalletDialog();
        },
        onError: (error: any) => {
            setError(error.response?.data?.detail || 'Error al actualizar balance');
        },
    });

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                email: user.email,
                username: user.username,
                full_name: user.full_name,
                password: '',
            });
        } else {
            setSelectedUser(null);
            setFormData({
                email: '',
                username: '',
                full_name: '',
                password: '',
            });
        }
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setFormData({
            email: '',
            username: '',
            full_name: '',
            password: '',
        });
        setError('');
    };

    const handleOpenWalletDialog = (user: User) => {
        setSelectedUser(user);
        setWalletAmount('');
        setError('');
        setOpenWalletDialog(true);
    };

    const handleCloseWalletDialog = () => {
        setOpenWalletDialog(false);
        setSelectedUser(null);
        setWalletAmount('');
        setError('');
    };

    const handleOpenAdjustDialog = async (user: User) => {
        setSelectedUser(user);
        setAdjustError('');
        setAdjustLoading(true);
        try {
            const res = await getWalletReconciliation(user.id);
            setWalletRecon(res.data.data);
            setAdjustAmount(res.data.data.wallet.balance.toString());
        } catch (e: any) {
            setWalletRecon(null);
            setAdjustAmount(user.wallet?.balance?.toString() || '');
            setAdjustError('Could not fetch wallet info');
        }
        setAdjustReason('');
        setAdjustLoading(false);
        setOpenAdjustDialog(true);
    };

    const handleCloseAdjustDialog = () => {
        setOpenAdjustDialog(false);
        setSelectedUser(null);
        setAdjustAmount('');
        setAdjustReason('');
        setAdjustError('');
        setWalletRecon(null);
    };

    const handleAdjustSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setAdjustLoading(true);
        setAdjustError('');
        try {
            await adjustWalletBalance(selectedUser.id, parseFloat(adjustAmount), adjustReason, 'admin');
            setOpenAdjustDialog(false);
            setSelectedUser(null);
            setAdjustAmount('');
            setAdjustReason('');
            setWalletRecon(null);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (err: any) {
            setAdjustError(err.response?.data?.detail || 'Error adjusting balance');
        }
        setAdjustLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            updateUserMutation.mutate({
                id: selectedUser.id,
                data: formData,
            });
        } else {
            createUserMutation.mutate(formData);
        }
    };

    const handleWalletSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            updateWalletMutation.mutate({
                userId: selectedUser.id,
                amount: parseFloat(walletAmount),
            });
        }
    };

    const columns: GridColDef[] = [
        { field: 'username', headerName: 'Usuario', width: 150 },
        { field: 'email', headerName: 'Correo', width: 200 },
        { field: 'full_name', headerName: 'Nombre completo', width: 200 },
        {
            field: 'wallet',
            headerName: 'Balance',
            width: 150,
            valueGetter: (params) =>
                params.row.wallet
                    ? `${params.row.wallet.balance} ${params.row.wallet.currency}`
                    : 'N/A',
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 300,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleOpenDialog(params.row)}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenWalletDialog(params.row)}
                        sx={{ ml: 1 }}
                    >
                        Gestionar Balance
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenAdjustDialog(params.row)}
                        sx={{ ml: 1 }}
                    >
                        Ajustar Saldo
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Usuarios</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Usuario
                </Button>
            </Box>

            <DataGrid
                rows={data?.items || []}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                loading={isLoading}
                rowCount={data?.total || 0}
                paginationMode="server"
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            margin="dense"
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Usuario"
                            fullWidth
                            required
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Nombre completo"
                            fullWidth
                            required
                            value={formData.full_name}
                            onChange={(e) =>
                                setFormData({ ...formData, full_name: e.target.value })
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Contraseña"
                            type="password"
                            fullWidth
                            required={!selectedUser}
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained">
                            {selectedUser ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openWalletDialog} onClose={handleCloseWalletDialog}>
                <DialogTitle>Gestionar Balance</DialogTitle>
                <form onSubmit={handleWalletSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Balance actual: {selectedUser?.wallet?.balance}{' '}
                            {selectedUser?.wallet?.currency}
                        </Typography>
                        <TextField
                            margin="dense"
                            label="Cantidad"
                            type="number"
                            fullWidth
                            required
                            value={walletAmount}
                            onChange={(e) => setWalletAmount(e.target.value)}
                            helperText="Ingrese un número positivo para agregar o negativo para restar"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseWalletDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained">
                            Actualizar Balance
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openAdjustDialog} onClose={handleCloseAdjustDialog}>
                <DialogTitle>Ajustar Saldo Manual</DialogTitle>
                <form onSubmit={handleAdjustSubmit}>
                    <DialogContent>
                        {adjustError && (
                            <Alert severity="error" sx={{ mb: 2 }}>{adjustError}</Alert>
                        )}
                        {walletRecon && (
                            <>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Current Balance:</b> {walletRecon.wallet.balance} {walletRecon.wallet.currency}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Calculated Balance:</b> {walletRecon.calculated_balance} {walletRecon.wallet.currency}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }} color={walletRecon.difference !== 0 ? 'error' : 'success.main'}>
                                    <b>Difference:</b> {walletRecon.difference}
                                </Typography>
                            </>
                        )}
                        <TextField
                            margin="dense"
                            label="New Balance"
                            type="number"
                            fullWidth
                            required
                            value={adjustAmount}
                            onChange={e => setAdjustAmount(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Reason"
                            fullWidth
                            required
                            value={adjustReason}
                            onChange={e => setAdjustReason(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAdjustDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={adjustLoading}>
                            {adjustLoading ? 'Adjusting...' : 'Adjust'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
} 