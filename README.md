# 🎮 Backoffice RGS

Panel de administración para el ecosistema RGS, desarrollado con React y Material-UI. Permite gestionar usuarios, operadores, ver reportes y monitorear el sistema.

## 🚀 Características

- Dashboard con métricas en tiempo real
- Gestión de usuarios y operadores
- Reportes detallados de transacciones
- Monitoreo de sesiones activas
- Gráficos y estadísticas
- Interfaz responsive y moderna

## 🛠️ Requisitos

- Node.js 16+
- npm 8+
- React 18+
- Material-UI 5+

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-org/rgs-backoffice.git
cd rgs-backoffice
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## 🚀 Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── services/      # Servicios API
├── hooks/         # Custom hooks
├── utils/         # Utilidades
├── context/       # Contextos React
└── assets/        # Recursos estáticos
```

## 📚 Documentación de Componentes

### Páginas Principales
- `/dashboard` - Vista general del sistema
- `/users` - Gestión de usuarios
- `/operators` - Gestión de operadores
- `/reports` - Reportes y estadísticas
- `/sessions` - Monitoreo de sesiones

### Componentes Clave
- `DashboardCard` - Tarjetas de métricas
- `DataTable` - Tabla de datos con paginación
- `Chart` - Gráficos y visualizaciones
- `UserForm` - Formulario de usuario
- `ReportFilter` - Filtros de reportes

## 🔑 Integración con RGS

Ejemplo de llamada a la API:

```javascript
import { api } from '../services/api';

// Obtener usuarios
const getUsers = async () => {
  const response = await api.get('/api/v1/backoffice/users');
  return response.data;
};

// Crear operador
const createOperator = async (operatorData) => {
  const response = await api.post('/api/v1/backoffice/operators', operatorData);
  return response.data;
};
```

## 🎨 Temas y Estilos

El proyecto usa Material-UI con un tema personalizado:

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // ... más configuraciones
});
```

## 🧪 Pruebas

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage
```

## 📊 Monitoreo

- Logs de desarrollo en consola
- Errores reportados a Sentry
- Métricas de rendimiento

## 🔒 Seguridad

- Autenticación JWT
- Protección de rutas
- Validación de formularios
- Sanitización de datos
- HTTPS en producción

## 🚀 Despliegue

```bash
# Build para producción
npm run build

# Preview build
npm run preview
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Soporte

Para soporte, email support@your-org.com o crea un issue en el repositorio.
