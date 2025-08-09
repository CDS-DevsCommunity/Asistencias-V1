# 🐘 Guía de Configuración PostgreSQL para Job Management API

## 📋 Requisitos Previos

### 1. Verificar Instalación de PostgreSQL
```bash
# Verificar si PostgreSQL está instalado
psql --version

# Verificar servicio (Windows)
sc query postgresql-x64-16  # o postgresql-x64-15, etc.
```

### 2. Estado Actual Detectado
✅ **PostgreSQL está ejecutándose en puerto 5432**
❌ **Falta configurar usuario/contraseña o base de datos**

## 🔧 Pasos de Configuración

### Paso 1: Acceder a PostgreSQL como Administrador
```bash
# Opción A: Si tienes usuario postgres configurado
psql -U postgres -h localhost

# Opción B: Como usuario de Windows con privilegios
psql -U tu_usuario_windows -h localhost

# Opción C: Usar pgAdmin (interfaz gráfica)
# Abrir pgAdmin -> Conectar a servidor local
```

### Paso 2: Crear Base de Datos y Usuario
```sql
-- Conectado a PostgreSQL, ejecutar estos comandos:

-- 1. Crear la base de datos
CREATE DATABASE asistencia;

-- 2. Crear usuario (si no existe)
CREATE USER postgres WITH PASSWORD 'alan123';

-- 3. Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE asistencia TO postgres;

-- 4. Verificar conexión
\c asistencia
\q
```

### Paso 3: Configurar Archivo .env

Tu archivo `.env` actual está configurado correctamente:
```env
# Database configuration
DB_NAME=asistencia
DB_USER=postgres
DB_PASSWORD=alan123
DB_HOST=localhost
DB_PORT=5432
```

## 🚀 Opciones de Configuración

### Opción A: Usar Credenciales del Sistema
Si ya tienes PostgreSQL configurado con tu usuario de Windows:

```env
# Actualizar .env con tus credenciales existentes
DB_NAME=asistencia
DB_USER=tu_usuario_actual
DB_PASSWORD=tu_password_actual
DB_HOST=localhost
DB_PORT=5432
```

### Opción B: Configurar Usuario Postgres
1. **Acceder a PostgreSQL como administrador**
2. **Cambiar contraseña del usuario postgres:**
   ```sql
   ALTER USER postgres PASSWORD 'alan123';
   ```

### Opción C: Crear Nuevo Usuario
```sql
-- Crear usuario específico para la aplicación
CREATE USER asistencia_user WITH PASSWORD 'secure_password_123';
CREATE DATABASE asistencia OWNER asistencia_user;
GRANT ALL PRIVILEGES ON DATABASE asistencia TO asistencia_user;
```

Luego actualizar `.env`:
```env
DB_NAME=asistencia
DB_USER=asistencia_user
DB_PASSWORD=secure_password_123
DB_HOST=localhost
DB_PORT=5432
```

## 🔍 Solución de Problemas

### Problema 1: "password authentication failed"
```bash
# Verificar configuración de autenticación
# Archivo: C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf
# Cambiar 'md5' por 'trust' temporalmente para configuración inicial

# Línea típica:
# host    all             all             127.0.0.1/32            md5
```

### Problema 2: "database does not exist"
```sql
-- Conectar a PostgreSQL y crear base de datos
psql -U postgres
CREATE DATABASE asistencia;
```

### Problema 3: "role does not exist"
```sql
-- Crear usuario postgres si no existe
CREATE USER postgres WITH SUPERUSER PASSWORD 'alan123';
```

## 🛠️ Comandos de Prueba

### 1. Probar Conexión Manual
```bash
# Probar conexión desde línea de comandos
psql -U postgres -h localhost -d asistencia

# Si funciona, verás el prompt:
# asistencia=#
```

### 2. Usar Script de Prueba
```bash
# Ejecutar nuestro script de prueba
python test_postgresql_connection.py
```

### 3. Probar con Django
```bash
# Ejecutar migraciones de Django
python manage.py migrate

# Si las migraciones funcionan, la conexión está correcta
```

## 📝 Configuración Alternativa con SQLite (Temporal)

Si necesitas continuar desarrollando mientras configuras PostgreSQL:

```python
# En settings.py, agregar configuración alternativa:
import os

if os.environ.get('USE_SQLITE') == 'True':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```

Luego en `.env`:
```env
USE_SQLITE=True  # Temporal para desarrollo
```

## 🎯 Próximos Pasos una vez Conectado

1. **Ejecutar migraciones:**
   ```bash
   python manage.py migrate
   ```

2. **Crear superusuario:**
   ```bash
   python manage.py createsuperuser
   ```

3. **Iniciar servidor:**
   ```bash
   python manage.py runserver 0.0.0.0:8001
   ```

4. **Verificar API:**
   ```bash
   python test_api.py
   ```

## 💡 Recomendaciones

1. **Seguridad:** Usar contraseñas fuertes en producción
2. **Backup:** Configurar respaldos automáticos de la base de datos
3. **Monitoreo:** Implementar logs de conexión y errores
4. **Performance:** Configurar índices apropiados para las consultas frecuentes

## 📞 ¿Necesitas Ayuda?

Si continúas teniendo problemas:
1. Verifica que PostgreSQL esté instalado y ejecutándose
2. Confirma las credenciales existentes en tu sistema
3. Usa pgAdmin para verificar la conexión gráficamente
4. Considera usar Docker para PostgreSQL si tienes problemas de configuración
