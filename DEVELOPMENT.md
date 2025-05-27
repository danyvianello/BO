# 🛠️ Guía de Desarrollo - RGS Backoffice

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm 9+
- Git

### Configuración Inicial
```bash
# Clonar el repositorio
git clone <repository-url>
cd rgs-backoffice

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## 🔧 Configuración de Entorno

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# App Configuration
VITE_APP_TITLE=RGS Backoffice

# Development Configuration
VITE_USE_MOCK_API=true
```

### Modo Mock API
Por defecto, la aplicación usa datos mock para desarrollo:
- ✅ No requiere backend
- ✅ Datos realistas pre-cargados
- ✅ Todas las operaciones CRUD funcionan
- ✅ Simulación de delays de red

Para usar API real, cambiar `VITE_USE_MOCK_API=false`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal
│   ├── ProtectedRoute.tsx
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── games/          # Gestión de juegos
│   ├── users/          # Gestión de usuarios
│   ├── operators/      # Gestión de operadores
│   └── ...
├── services/           # Servicios de API
│   ├── api.ts         # API real
│   ├── mockApi.ts     # API mock
│   └── index.ts       # Servicio unificado
├── stores/             # Estado global (Zustand)
│   ├── authStore.ts   # Autenticación
│   └── uiStore.ts     # UI y notificaciones
├── types/              # Tipos TypeScript
├── utils/              # Utilidades
└── App.tsx            # Componente principal
```

## 🎯 Funcionalidades Principales

### Autenticación
- Login: `admin` / `admin123`
- JWT tokens
- Protección de rutas
- Persistencia de sesión

### Módulos Disponibles
1. **Dashboard** - Panel principal
2. **Usuarios** - CRUD completo
3. **Operadores** - Gestión de casinos
4. **Monedas** - Multi-moneda
5. **Juegos** - Catálogo de juegos
6. **Proveedores** - Integración de proveedores
7. **Sesiones** - Monitoreo en tiempo real
8. **Transacciones** - Seguimiento financiero
9. **Reportes** - Generación de reportes

## 🔨 Scripts de Desarrollo

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build para producción
npm run preview         # Preview del build

# Calidad de código
npm run lint            # ESLint
npm run type-check      # Verificación de tipos
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Material UI** - Componentes UI
- **Vite** - Build tool

### Estado y Datos
- **Zustand** - Estado global
- **React Query** - Cache y sincronización
- **React Hook Form** - Formularios

### Routing y Navegación
- **React Router v6** - Routing
- **Material UI Navigation** - Sidebar y navegación

## 🐛 Debugging

### Herramientas de Desarrollo
- React DevTools
- Redux DevTools (para Zustand)
- Network tab para API calls

### Logs Útiles
```javascript
// En cualquier componente
console.log('Estado auth:', useAuthStore.getState());
console.log('Notificaciones:', useUIStore.getState().notifications);
```

### Problemas Comunes

#### 1. Problemas de Interactividad
Si los clicks no funcionan:
- Verificar CSS `pointer-events`
- Revisar overlays invisibles
- Comprobar z-index de elementos

#### 2. Errores de API
- Verificar `VITE_USE_MOCK_API` en `.env`
- Revisar configuración de CORS
- Comprobar URLs de API

#### 3. Problemas de Autenticación
- Limpiar localStorage: `localStorage.clear()`
- Verificar token JWT válido
- Comprobar rutas protegidas

## 🚀 Deployment

### Build para Producción
```bash
npm run build
```

### Variables de Entorno para Producción
```bash
VITE_API_URL=https://api.production.com
VITE_USE_MOCK_API=false
```

## 🤝 Contribución

### Workflow de Git
```bash
# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commit
git add .
git commit -m "feat: descripción del cambio"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

### Convenciones de Commits
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Cambios de estilo
- `refactor:` - Refactorización
- `test:` - Tests

## 📚 Recursos Adicionales

- [Material UI Docs](https://mui.com/)
- [React Query Docs](https://tanstack.com/query)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Vite Docs](https://vitejs.dev/)

---

**¡Happy Coding! 🎉** 