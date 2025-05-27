# 🎰 RGS Backoffice

Sistema de administración completo para Remote Gaming Server (RGS) que permite gestionar operadores, juegos, proveedores y transacciones de manera eficiente y profesional.

## ✨ Características Principales

- 🔐 **Autenticación JWT** - Sistema de login seguro con protección de rutas
- 👥 **Gestión de Usuarios** - CRUD completo con roles y permisos
- 🏢 **Gestión de Operadores** - Administración de casinos y configuraciones
- 💰 **Gestión de Monedas** - Soporte multi-moneda con tasas de cambio
- 🎮 **Administración de Juegos** - Catálogo completo con límites de apuesta
- 🔧 **Gestión de Proveedores** - Integración con proveedores de juegos
- 📊 **Sesiones de Juego** - Monitoreo en tiempo real de actividad
- 💳 **Transacciones** - Seguimiento completo de apuestas y ganancias
- 📈 **Reportes** - Generación y descarga de reportes personalizados
- 🌐 **Interfaz Responsive** - Optimizada para desktop y móvil
- 🎨 **Material UI** - Diseño moderno y profesional

## 🚀 Tecnologías

- **Frontend:** React 18 + TypeScript
- **UI Framework:** Material UI v5
- **Routing:** React Router v6
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Styling:** CSS-in-JS + Material UI

## 📋 Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio:**
```bash
git clone <tu-repositorio-url>
cd rgs-backoffice
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno (opcional):**
```bash
# Crear archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_TITLE=RGS Backoffice
VITE_USE_MOCK_API=true
```

4. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

5. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🔑 Credenciales de Acceso

Para acceder al sistema en modo desarrollo:

- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 🏗️ Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── config/        # Configuración de la aplicación
├── hooks/         # Hooks personalizados
├── layouts/       # Layouts de la aplicación
├── pages/         # Páginas de la aplicación
├── services/      # Servicios de API
├── stores/        # Estado global (Zustand)
├── types/         # Tipos TypeScript
├── utils/         # Utilidades
└── App.tsx        # Componente principal
```

## 🎯 Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- ✅ Login/Logout con JWT
- ✅ Protección de rutas privadas
- ✅ Persistencia de sesión
- ✅ Manejo automático de tokens

### 👥 Gestión de Usuarios
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Asignación de roles (Admin, Operador, Usuario)
- ✅ Control de estado (Activo/Inactivo)
- ✅ Validación de formularios

### 🏢 Gestión de Operadores
- ✅ Configuración de casinos
- ✅ Gestión de comisiones
- ✅ Límites de apuestas personalizables
- ✅ Control de estado y activación

### 💰 Gestión de Monedas
- ✅ Soporte multi-moneda
- ✅ Tasas de cambio dinámicas
- ✅ Configuración de decimales
- ✅ Símbolos de moneda

### 🎮 Gestión de Juegos
- ✅ Catálogo completo de juegos
- ✅ Integración con proveedores
- ✅ Configuración de límites
- ✅ Categorización por tipo

### 🔧 Gestión de Proveedores
- ✅ Registro de proveedores de juegos
- ✅ Configuración de API Keys
- ✅ Estado y activación
- ✅ Integración segura

### 📊 Monitoreo de Sesiones
- ✅ Visualización en tiempo real
- ✅ Detalles completos de sesión
- ✅ Cálculo de ganancias/pérdidas
- ✅ Duración y estadísticas

### 💳 Gestión de Transacciones
- ✅ Seguimiento completo
- ✅ Filtros avanzados
- ✅ Estados de transacción
- ✅ Detalles financieros

### 📈 Sistema de Reportes
- ✅ Generación automática
- ✅ Múltiples tipos de reporte
- ✅ Filtros personalizables
- ✅ Descarga de archivos

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción
npm run lint         # Ejecuta ESLint

# Utilidades
npm run type-check   # Verifica tipos TypeScript
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```bash
# .env
VITE_API_URL=http://localhost:8000    # URL del backend
VITE_WS_URL=ws://localhost:8000       # WebSocket URL
VITE_APP_TITLE=RGS Backoffice        # Título de la app
VITE_USE_MOCK_API=true               # Usar datos mock
```

### Modo Mock API

El proyecto incluye un sistema completo de datos mock que permite desarrollar sin necesidad de un backend:

- ✅ Datos realistas pre-cargados
- ✅ Simulación de delays de red
- ✅ Operaciones CRUD funcionales
- ✅ Manejo de errores

## 🎨 Convenciones de Código

- **TypeScript** para tipado estático
- **ESLint** para linting
- **Prettier** para formateo automático
- **Material UI** para componentes
- **Conventional Commits** para mensajes

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crea** una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [documentación](#)
2. Busca en [Issues existentes](#)
3. Crea un [nuevo Issue](#)

---

**Desarrollado con ❤️ para la industria del gaming** 