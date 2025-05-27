export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatNumber = (number: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
};

export const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value / 100);
};

export const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente',
        completed: 'Completado',
        cancelled: 'Cancelado',
        failed: 'Fallido',
    };
    return statusMap[status] || status;
};

export const formatRole = (role: string): string => {
    const roleMap: Record<string, string> = {
        admin: 'Administrador',
        operator: 'Operador',
        user: 'Usuario',
    };
    return roleMap[role] || role;
}; 