import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';
import Operators from './pages/operators/Operators';
import CreateOperator from './pages/operators/CreateOperator';
import Currencies from './pages/currencies/Currencies';
import CreateCurrency from './pages/currencies/CreateCurrency';
import Games from './pages/games/Games';
import GameProviders from './pages/games/Providers';
import Sessions from './pages/sessions/Sessions';
import Reports from './pages/reports/Reports';
import Transactions from './pages/transactions/Transactions';
import TestPage from './pages/TestPage';
import { useAuthStore } from './stores/authStore';
import { showSecurityWarnings } from './config/security';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    components: {
        // Asegurar que los componentes sean clickeables
        MuiButton: {
            styleOverrides: {
                root: {
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    pointerEvents: 'auto',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                },
            },
        },
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const App: React.FC = () => {
    const { isAuthenticated } = useAuthStore();

    // Mostrar advertencias de seguridad en desarrollo
    useEffect(() => {
        showSecurityWarnings();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <div style={{ pointerEvents: 'auto', userSelect: 'auto' }}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Users />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users/create"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <CreateUser />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/operators"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Operators />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/operators/create"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <CreateOperator />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/currencies"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Currencies />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/currencies/create"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <CreateCurrency />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                            <Route
                                path="/games"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Games />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/providers"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <GameProviders />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/sessions"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Sessions />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reports"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Reports />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/transactions"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Transactions />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/test"
                                element={<TestPage />}
                            />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App; 