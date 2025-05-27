# 🔐 Guía de Seguridad - RGS Backoffice

## ⚠️ IMPORTANTE: Configuración de Seguridad

### 🚨 Modo Desarrollo vs Producción

#### 🛠️ **Modo Desarrollo (Actual)**
- ✅ **Datos Mock:** Todos los datos son ficticios
- ✅ **Credenciales de Prueba:** `admin` / `admin123`
- ✅ **API Keys Falsas:** Todas las claves son de ejemplo
- ✅ **Sin Riesgos:** No hay datos reales expuestos

#### 🏭 **Modo Producción (Para Deploy)**
- 🔒 **API Real:** Conexión a backend seguro
- 🔒 **Autenticación JWT:** Tokens reales con expiración
- 🔒 **Variables de Entorno:** Credenciales en archivos seguros
- 🔒 **HTTPS Obligatorio:** Comunicación encriptada

## 🔧 Configuración Segura para Producción

### 1. Variables de Entorno (.env)
```bash
# API Configuration
VITE_API_URL=https://api.tu-dominio.com
VITE_WS_URL=wss://api.tu-dominio.com

# Security Configuration
VITE_USE_MOCK_API=false
VITE_ADMIN_USER=tu_usuario_admin
VITE_ADMIN_PASS=tu_contraseña_segura

# Optional: Show credentials in console (ONLY for development)
VITE_SHOW_DEV_CREDENTIALS=false
```

### 2. Configuración del Servidor
```bash
# Producción
NODE_ENV=production
HTTPS=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

## 🛡️ Medidas de Seguridad Implementadas

### ✅ **Autenticación**
- JWT tokens con expiración
- Persistencia segura en localStorage
- Logout automático al expirar
- Protección de rutas privadas

### ✅ **Validación de Datos**
- Validación de formularios
- Sanitización de inputs
- Manejo seguro de errores
- Rate limiting simulado

### ✅ **Configuración Flexible**
- Variables de entorno para credenciales
- Separación desarrollo/producción
- Advertencias de seguridad visibles
- Configuración centralizada

## 🚀 Checklist para Producción

### Antes del Deploy:
- [ ] Cambiar `VITE_USE_MOCK_API=false`
- [ ] Configurar URL de API real
- [ ] Establecer credenciales seguras
- [ ] Habilitar HTTPS
- [ ] Configurar CORS correctamente
- [ ] Implementar rate limiting
- [ ] Configurar logs de seguridad
- [ ] Realizar pruebas de penetración

### Variables Críticas:
```bash
# ❌ NO usar en producción
VITE_USE_MOCK_API=true
VITE_ADMIN_PASS=admin123

# ✅ Usar en producción
VITE_USE_MOCK_API=false
VITE_ADMIN_PASS=contraseña_muy_segura_123!@#
```

## 🔍 Monitoreo de Seguridad

### Logs a Implementar:
- Intentos de login fallidos
- Accesos a rutas protegidas
- Cambios en datos críticos
- Errores de autenticación
- Actividad sospechosa

### Alertas Recomendadas:
- Múltiples intentos de login fallidos
- Acceso desde IPs desconocidas
- Modificaciones masivas de datos
- Errores de API frecuentes

## 📞 Contacto de Seguridad

Si encuentras vulnerabilidades de seguridad:
1. **NO** las publiques públicamente
2. Contacta al equipo de desarrollo
3. Proporciona detalles técnicos
4. Espera confirmación antes de divulgar

## 🔄 Actualizaciones de Seguridad

- Revisar dependencias regularmente
- Actualizar tokens de API
- Rotar credenciales periódicamente
- Monitorear logs de seguridad
- Realizar auditorías de código

---

**⚠️ RECORDATORIO:** Este proyecto está configurado para desarrollo. Asegúrate de seguir todas las medidas de seguridad antes de usar en producción. 