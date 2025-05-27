import React, { useState } from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Casino as CasinoIcon,
    AttachMoney as MoneyIcon,
    Assessment as AssessmentIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import NotificationSystem from './NotificationSystem';
import LoadingOverlay from './LoadingOverlay';

const drawerWidth = 240;

interface LayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
    { text: 'Operadores', icon: <SettingsIcon />, path: '/operators' },
    { text: 'Monedas', icon: <MoneyIcon />, path: '/currencies' },
    { text: 'Juegos', icon: <CasinoIcon />, path: '/games' },
    { text: 'Proveedores', icon: <SettingsIcon />, path: '/providers' },
    { text: 'Sesiones', icon: <AssessmentIcon />, path: '/sessions' },
    { text: 'Transacciones', icon: <MoneyIcon />, path: '/transactions' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reports' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { addNotification, notifications, removeNotification, isLoading, loadingMessage } = useUIStore();
    const { logout } = useAuthStore();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        addNotification('Sesión cerrada exitosamente', 'success');
        navigate('/login');
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    RGS Backoffice
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: location.pathname === item.path
                                        ? theme.palette.primary.main
                                        : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cerrar Sesión" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {menuItems.find((item) => item.path === location.pathname)?.text || 'RGS Backoffice'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
            <div id="notification-container" />
            <div id="loading-container" />
            <NotificationSystem
                notifications={notifications}
                onClose={removeNotification}
            />
            <LoadingOverlay
                isLoading={isLoading}
                message={loadingMessage}
            />
        </Box>
    );
};

export default Layout; 