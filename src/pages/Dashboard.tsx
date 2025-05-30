import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
} from '@mui/material';
import {
    People as PeopleIcon,
    Casino as CasinoIcon,
    AttachMoney as MoneyIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
    getUsers,
    getGames,
    getTransactions,
    getSessions,
} from '../services/api';
import { formatCurrency } from '../utils/formatters';

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, icon, color }) => (
    <Card>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        backgroundColor: `${color}20`,
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" component="div">
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const Dashboard: React.FC = () => {
    const theme = useTheme();

    const { data: usersResponse } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    const { data: gamesResponse } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    const { data: transactionsResponse } = useQuery({
        queryKey: ['transactions'],
        queryFn: getTransactions,
    });

    const { data: sessionsResponse } = useQuery({
        queryKey: ['sessions'],
        queryFn: getSessions,
    });

    const totalUsers = usersResponse?.data.data.length || 0;
    const totalGames = gamesResponse?.data.data.length || 0;
    const totalTransactions = transactionsResponse?.data.data.length || 0;
    const totalSessions = sessionsResponse?.data.data.length || 0;

    const transactions = transactionsResponse?.data.data || [];
    const totalAmount = Array.isArray(transactions)
        ? transactions.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0)
        : 0;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Usuarios"
                        value={totalUsers}
                        icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Juegos"
                        value={totalGames}
                        icon={<CasinoIcon sx={{ color: theme.palette.success.main }} />}
                        color={theme.palette.success.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Transacciones"
                        value={formatCurrency(totalAmount)}
                        icon={<MoneyIcon sx={{ color: theme.palette.warning.main }} />}
                        color={theme.palette.warning.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Sesiones"
                        value={totalSessions}
                        icon={<AssessmentIcon sx={{ color: theme.palette.info.main }} />}
                        color={theme.palette.info.main}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 