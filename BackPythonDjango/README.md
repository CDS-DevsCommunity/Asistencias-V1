# 📋 Job Management API - Microservicio Django

Este microservicio Django REST complementa el sistema de asistencias desarrollado en Spring Boot, manejando la gestión de eventos, escenarios, equipamientos y tipos de eventos.

---

## 🏗️ Arquitectura del Sistema

### Microservicios
- **Spring Boot (Puerto 8080)**: Gestión de usuarios, personas, posiciones, registros de asistencia
- **Django (Puerto 8001)**: Gestión de eventos, escenarios, equipamientos, tipos de eventos

### Base de Datos
- **PostgreSQL**: Base de datos compartida entre ambos microservicios
- Puerto: 5433
- Base de datos: `asistencia`

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.11+
- PostgreSQL 15+
- Docker y Docker Compose (opcional)

### Instalación Local

1. **Clonar el repositorio y navegar a la carpeta del proyecto**
```bash
cd BackPythonDjango
```

2. **Crear y activar entorno virtual**
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
DB_NAME=asistencia
DB_USER=postgres
DB_PASSWORD=alan123
DB_HOST=localhost
DB_PORT=5433
SECRET_KEY=ZXN0ZUVzVW5TZWNyZXRvU3VwZXJMYXJnb1lTZWd1cm8xMjM0UHl0aG9uRGphbmdv
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOW_ALL_ORIGINS=True
```

5. **Ejecutar migraciones**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Crear superusuario**
```bash
python manage.py createsuperuser
```

7. **Ejecutar servidor de desarrollo**
```bash
python manage.py runserver 0.0.0.0:8001
```

### Instalación con Docker

1. **Construir y ejecutar con Docker Compose**
```bash
docker-compose up --build
```

---

## 📍 Endpoints de la API

### 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Registro de usuario |
| POST | `/api/auth/login/` | Inicio de sesión |
| POST | `/api/auth/logout/` | Cerrar sesión |
| GET | `/api/auth/profile/` | Obtener perfil de usuario |
| PUT | `/api/auth/profile/update/` | Actualizar perfil |
| GET | `/api/auth/verify/` | Verificar token JWT |

### 📅 Gestión de Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/eventos/` | Listar eventos |
| POST | `/api/eventos/` | Crear evento |
| GET | `/api/eventos/{id}/` | Obtener evento específico |
| PUT | `/api/eventos/{id}/` | Actualizar evento |
| DELETE | `/api/eventos/{id}/` | Eliminar evento |
| POST | `/api/eventos/{id}/inscribir/` | Inscribir al evento |
| POST | `/api/eventos/{id}/cancelar_inscripcion/` | Cancelar inscripción |
| GET | `/api/eventos/proximos/` | Eventos próximos |
| GET | `/api/eventos/estadisticas/` | Estadísticas de eventos |

### 🏟️ Gestión de Escenarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/escenarios/` | Listar escenarios |
| POST | `/api/escenarios/` | Crear escenario |
| GET | `/api/escenarios/{id}/` | Obtener escenario específico |
| PUT | `/api/escenarios/{id}/` | Actualizar escenario |
| DELETE | `/api/escenarios/{id}/` | Eliminar escenario |
| GET | `/api/escenarios/{id}/eventos/` | Eventos del escenario |
| GET | `/api/escenarios/disponibles/` | Escenarios disponibles |

### 🔧 Gestión de Equipamientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/equipamientos/` | Listar equipamientos |
| POST | `/api/equipamientos/` | Crear equipamiento |
| GET | `/api/equipamientos/{id}/` | Obtener equipamiento específico |
| PUT | `/api/equipamientos/{id}/` | Actualizar equipamiento |
| DELETE | `/api/equipamientos/{id}/` | Eliminar equipamiento |
| GET | `/api/equipamientos/{id}/prestamos/` | Préstamos del equipamiento |

### 📋 Gestión de Tipos de Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tipos/` | Listar tipos de eventos |
| POST | `/api/tipos/` | Crear tipo de evento |
| GET | `/api/tipos/{id}/` | Obtener tipo específico |
| PUT | `/api/tipos/{id}/` | Actualizar tipo |
| DELETE | `/api/tipos/{id}/` | Eliminar tipo |

### 📦 Gestión de Equipamientos Prestados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/equipamientos-prestados/` | Listar préstamos |
| POST | `/api/equipamientos-prestados/` | Crear préstamo |
| PUT | `/api/equipamientos-prestados/{id}/` | Actualizar préstamo |
| DELETE | `/api/equipamientos-prestados/{id}/` | Eliminar préstamo |
| POST | `/api/equipamientos-prestados/{id}/marcar_devuelto/` | Marcar como devuelto |
| POST | `/api/equipamientos-prestados/{id}/marcar_prestado/` | Marcar como prestado |
| GET | `/api/equipamientos-prestados/pendientes/` | Préstamos pendientes |

---

## 📖 Documentación de la API

### Swagger UI
Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva:

- **Swagger UI**: http://localhost:8001/swagger/
- **ReDoc**: http://localhost:8001/redoc/

### Autenticación JWT

Para usar los endpoints protegidos, necesitas incluir el token JWT en el header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔄 Flujos de Trabajo de la API

### 📋 Flujo Completo de Gestión de Eventos

#### 1. **Autenticación y Configuración Inicial**

```bash
# 1.1 Registrar nuevo usuario
POST /api/auth/register/
{
  "username": "event_manager",
  "email": "manager@company.com",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "first_name": "Event",
  "last_name": "Manager"
}

# 1.2 Iniciar sesión y obtener token
POST /api/auth/login/
{
  "username": "event_manager",
  "password": "securepass123"
}
# Respuesta: { "access": "eyJ...", "refresh": "eyJ..." }
```

#### 2. **Configuración de Tipos y Escenarios**

```bash
# 2.1 Crear tipos de eventos
POST /api/tipos/
Authorization: Bearer <token>
{
  "nombre": "Conferencia",
  "descripcion": "Eventos de conferencias profesionales"
}

POST /api/tipos/
Authorization: Bearer <token>
{
  "nombre": "Workshop",
  "descripcion": "Talleres prácticos y educativos"
}

# 2.2 Crear escenarios
POST /api/escenarios/
Authorization: Bearer <token>
{
  "nombre": "Auditorio Principal",
  "ubicacion": "Edificio A - Piso 2",
  "descripcion": "Auditorio con capacidad para eventos grandes",
  "capacidad": 200,
  "area": 150.50
}

POST /api/escenarios/
Authorization: Bearer <token>
{
  "nombre": "Sala de Reuniones",
  "ubicacion": "Edificio B - Piso 1",
  "descripcion": "Sala para eventos pequeños",
  "capacidad": 50,
  "area": 45.00
}
```

#### 3. **Gestión de Equipamientos**

```bash
# 3.1 Crear equipamientos disponibles
POST /api/equipamientos/
Authorization: Bearer <token>
{
  "nombre": "Proyector HD"
}

POST /api/equipamientos/
Authorization: Bearer <token>
{
  "nombre": "Sistema de Audio"
}

POST /api/equipamientos/
Authorization: Bearer <token>
{
  "nombre": "Micrófono Inalámbrico"
}

# 3.2 Listar equipamientos disponibles
GET /api/equipamientos/
Authorization: Bearer <token>
```

#### 4. **Creación de Eventos**

```bash
# 4.1 Verificar escenarios disponibles para fecha específica
GET /api/escenarios/disponibles/?fecha=2025-12-15
Authorization: Bearer <token>

# 4.2 Crear evento completo
POST /api/eventos/
Authorization: Bearer <token>
{
  "titulo": "Conferencia Tecnológica 2025",
  "descripcion": "Conferencia sobre las últimas tendencias en tecnología",
  "direccion": "Centro de Convenciones, Sala Principal",
  "fecha": "2025-12-15",
  "hora_inicio": "09:00:00",
  "hora_fin": "17:00:00",
  "cupo_maximo": 150,
  "cupo_disponible": 150,
  "encargado": "Juan Pérez",
  "tipo": 1,
  "escenario": 1,
  "equipamientos": [
    {
      "equipamiento_id": 1,
      "cantidad": 2,
      "descripcion": "Proyectores para presentaciones principales"
    },
    {
      "equipamiento_id": 2,
      "cantidad": 1,
      "descripcion": "Sistema de audio principal"
    }
  ]
}
```

#### 5. **Gestión de Inscripciones**

```bash
# 5.1 Inscribir personas al evento
POST /api/eventos/1/inscribir/
Authorization: Bearer <token>

# 5.2 Verificar cupos disponibles
GET /api/eventos/1/
Authorization: Bearer <token>

# 5.3 Cancelar inscripción si es necesario
POST /api/eventos/1/cancelar_inscripcion/
Authorization: Bearer <token>
```

#### 6. **Gestión de Equipamientos Prestados**

```bash
# 6.1 Listar equipamientos prestados para un evento
GET /api/equipamientos-prestados/?evento=1
Authorization: Bearer <token>

# 6.2 Marcar equipamiento como devuelto después del evento
POST /api/equipamientos-prestados/1/marcar_devuelto/
Authorization: Bearer <token>

# 6.3 Ver equipamientos pendientes de devolución
GET /api/equipamientos-prestados/pendientes/
Authorization: Bearer <token>
```

### 📊 Flujo de Consultas y Estadísticas

```bash
# 1. Obtener eventos próximos
GET /api/eventos/proximos/
Authorization: Bearer <token>

# 2. Filtrar eventos por fecha y tipo
GET /api/eventos/?fecha_inicio=2025-12-01&fecha_fin=2025-12-31&tipo=1
Authorization: Bearer <token>

# 3. Obtener eventos disponibles (con cupos)
GET /api/eventos/?disponibles=true
Authorization: Bearer <token>

# 4. Obtener estadísticas generales
GET /api/eventos/estadisticas/
Authorization: Bearer <token>

# 5. Buscar eventos por palabra clave
GET /api/eventos/?search=tecnología
Authorization: Bearer <token>

# 6. Obtener eventos de un escenario específico
GET /api/escenarios/1/eventos/
Authorization: Bearer <token>
```

### 🔧 Flujo de Administración

```bash
# 1. Verificar token válido
GET /api/auth/verify/
Authorization: Bearer <token>

# 2. Actualizar perfil de usuario
PUT /api/auth/profile/update/
Authorization: Bearer <token>
{
  "first_name": "Juan Carlos",
  "last_name": "Administrador",
  "email": "admin@company.com"
}

# 3. Obtener información del usuario actual
GET /api/auth/profile/
Authorization: Bearer <token>

# 4. Cerrar sesión
POST /api/auth/logout/
Authorization: Bearer <token>
{
  "refresh": "<refresh_token>"
}
```

### 📈 Flujo de Monitoreo y Mantenimiento

```bash
# 1. Listar todos los tipos de eventos con búsqueda
GET /api/tipos/?search=conferencia&ordering=nombre
Authorization: Bearer <token>

# 2. Obtener escenarios ordenados por capacidad
GET /api/escenarios/?ordering=-capacidad
Authorization: Bearer <token>

# 3. Filtrar equipamientos prestados por estado
GET /api/equipamientos-prestados/?devuelto=false
Authorization: Bearer <token>

# 4. Actualizar información de un evento
PUT /api/eventos/1/
Authorization: Bearer <token>
{
  "titulo": "Conferencia Tecnológica 2025 - ACTUALIZADA",
  "cupo_disponible": 100
}

# 5. Eliminar evento si es necesario
DELETE /api/eventos/1/
Authorization: Bearer <token>
```

---

## 🎯 Guía de Gestión y Mejores Prácticas

### 📋 Orden Recomendado de Configuración

1. **Configuración Inicial del Sistema**
   ```bash
   # Paso 1: Autenticación
   POST /api/auth/login/ → Obtener token
   
   # Paso 2: Crear tipos de eventos básicos
   POST /api/tipos/ → Crear "Conferencia", "Workshop", "Reunión", etc.
   
   # Paso 3: Configurar escenarios
   POST /api/escenarios/ → Crear espacios físicos disponibles
   
   # Paso 4: Registrar equipamientos
   POST /api/equipamientos/ → Crear inventario de equipos
   ```

2. **Gestión Diaria de Eventos**
   ```bash
   # Verificar disponibilidad
   GET /api/escenarios/disponibles/?fecha=YYYY-MM-DD
   
   # Crear evento
   POST /api/eventos/ (con equipamientos incluidos)
   
   # Gestionar inscripciones
   POST /api/eventos/{id}/inscribir/
   
   # Monitorear estado
   GET /api/eventos/estadisticas/
   ```

### 🔍 Códigos de Estado HTTP y Manejo de Errores

| Código | Significado | Acción Recomendada |
|--------|-------------|-------------------|
| **200** | ✅ Éxito | Continuar con el flujo |
| **201** | ✅ Creado | Recurso creado exitosamente |
| **400** | ❌ Error de validación | Revisar datos enviados |
| **401** | ❌ No autorizado | Verificar token JWT |
| **403** | ❌ Prohibido | Verificar permisos |
| **404** | ❌ No encontrado | Verificar ID del recurso |
| **500** | ❌ Error del servidor | Contactar administrador |

### 📊 Filtros y Búsquedas Avanzadas

#### Eventos
```bash
# Filtrar por rango de fechas
GET /api/eventos/?fecha_inicio=2025-01-01&fecha_fin=2025-12-31

# Buscar por texto
GET /api/eventos/?search=tecnología

# Filtrar por tipo y escenario
GET /api/eventos/?tipo=1&escenario=2

# Ordenar por fecha
GET /api/eventos/?ordering=-fecha

# Solo eventos con cupos disponibles
GET /api/eventos/?disponibles=true

# Paginación
GET /api/eventos/?page=2
```

#### Escenarios
```bash
# Buscar por nombre o ubicación
GET /api/escenarios/?search=auditorio

# Ordenar por capacidad
GET /api/escenarios/?ordering=-capacidad

# Escenarios disponibles en fecha específica
GET /api/escenarios/disponibles/?fecha=2025-12-15
```

#### Equipamientos Prestados
```bash
# Solo equipamientos no devueltos
GET /api/equipamientos-prestados/?devuelto=false

# Filtrar por evento específico
GET /api/equipamientos-prestados/?evento=1

# Filtrar por equipamiento específico
GET /api/equipamientos-prestados/?equipamiento=1
```

### 🔐 Gestión de Seguridad

#### Tokens JWT
```bash
# Los tokens tienen duración limitada (30 minutos por defecto)
# Usa refresh token para obtener nuevo access token
POST /api/token/refresh/
{
  "refresh": "<refresh_token>"
}

# Verificar si token es válido
GET /api/auth/verify/
Authorization: Bearer <token>
```

#### Mejores Prácticas de Seguridad
- 🔑 Nunca expongas tokens en logs
- ⏰ Renueva tokens antes de que expiren
- 🚪 Siempre cierra sesión al terminar
- 🔒 Usa HTTPS en producción

### 📈 Monitoreo y Métricas

#### Endpoints de Estadísticas
```bash
# Estadísticas generales de eventos
GET /api/eventos/estadisticas/
# Respuesta:
{
  "total_eventos": 25,
  "eventos_llenos": 5,
  "eventos_disponibles": 20,
  "ocupacion_promedio": 65.5
}

# Equipamientos pendientes de devolución
GET /api/equipamientos-prestados/pendientes/

# Eventos próximos (próximos 10)
GET /api/eventos/proximos/
```

#### Indicadores Clave de Rendimiento (KPIs)
- **Ocupación promedio**: Mide eficiencia de eventos
- **Equipamientos pendientes**: Control de inventario
- **Eventos próximos**: Planificación adelantada

### 🚨 Resolución de Problemas Comunes

#### Error 401 - Token Inválido
```bash
# Problema: Token expirado o inválido
# Solución: Renovar token
POST /api/token/refresh/
{
  "refresh": "<refresh_token>"
}
```

#### Error 400 - Validación de Datos
```bash
# Problema: Datos incorrectos en la petición
# Solución: Verificar formato de fechas, campos requeridos
# Ejemplo fecha correcta: "2025-12-15"
# Ejemplo hora correcta: "14:30:00"
```

#### Error 404 - Recurso No Encontrado
```bash
# Problema: ID de recurso no existe
# Solución: Verificar que el recurso existe
GET /api/eventos/  # Listar todos para verificar IDs
```

### 📋 Checklist de Validaciones

#### Antes de Crear un Evento
- [ ] ✅ Tipo de evento existe
- [ ] ✅ Escenario está disponible en la fecha
- [ ] ✅ Fecha no es en el pasado
- [ ] ✅ Hora de fin > hora de inicio
- [ ] ✅ Cupo disponible ≤ cupo máximo
- [ ] ✅ Equipamientos solicitados existen

#### Antes de Eliminar Recursos
- [ ] ✅ Verificar dependencias (ej: eventos asociados)
- [ ] ✅ Confirmar que no hay inscripciones activas
- [ ] ✅ Marcar equipamientos como devueltos

### 🔄 Integración con Spring Boot

#### Comunicación entre Microservicios
```bash
# Django → Spring Boot (ejemplo)
# Verificar usuario existe antes de crear evento
curl -X GET http://localhost:8080/cds/users/{user_id} \
  -H "Authorization: Bearer <spring_boot_token>"

# Spring Boot → Django (ejemplo)
# Obtener eventos de usuario desde Spring Boot
curl -X GET http://localhost:8001/api/eventos/?encargado={user_name} \
  -H "Authorization: Bearer <django_token>"
```

#### Sincronización de Datos
- 🔄 Usuarios creados en Spring Boot pueden gestionar eventos en Django
- 📊 Reportes combinados usando datos de ambos microservicios
- 🔗 Referencias cruzadas por IDs de usuario y persona

---

## 🗄️ Modelos de Datos

### Tipo
- `nombre`: Nombre del tipo de evento
- `descripcion`: Descripción del tipo

### Escenario
- `nombre`: Nombre del escenario
- `ubicacion`: Ubicación del escenario
- `descripcion`: Descripción del escenario
- `capacidad`: Capacidad máxima
- `area`: Área en metros cuadrados

### Equipamiento
- `nombre`: Nombre del equipamiento

### Evento
- `titulo`: Título del evento
- `descripcion`: Descripción del evento
- `direccion`: Dirección del evento
- `fecha`: Fecha del evento
- `hora_inicio`: Hora de inicio
- `hora_fin`: Hora de finalización
- `cupo_maximo`: Cupo máximo de asistentes
- `cupo_disponible`: Cupo disponible actual
- `encargado`: Persona responsable
- `imagen`: Imagen del evento (opcional)
- `tipo`: Relación con Tipo
- `escenario`: Relación con Escenario

### EquipamientoPrestado
- `cantidad`: Cantidad prestada
- `devuelto`: Estado de devolución
- `descripcion`: Descripción adicional
- `equipamiento`: Relación con Equipamiento
- `evento`: Relación con Evento

---

## 🔧 Configuración de Desarrollo

### Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DEBUG` | Modo debug | `True` |
| `SECRET_KEY` | Clave secreta de Django | (generada) |
| `DB_NAME` | Nombre de la base de datos | `asistencia` |
| `DB_USER` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `alan123` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5433` |
| `CORS_ALLOW_ALL_ORIGINS` | Permitir todos los orígenes CORS | `True` |

---

## 🧪 Testing

Para ejecutar las pruebas:

```bash
python manage.py test
```

---

## 📊 Monitoreo y Logs

Los logs de la aplicación se muestran en la consola. Para entornos de producción, considera configurar un sistema de logging más robusto.

---

---

## 🚀 Inicio Rápido - Configuración en 5 Minutos

### Paso 1: Arrancar el Servidor
```bash
# En Windows
cd BackPythonDjango
.\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8001

# En Linux/Mac
cd BackPythonDjango
source venv/bin/activate
python manage.py runserver 0.0.0.0:8001
```

### Paso 2: Probar la API
```bash
# Abrir en navegador
http://localhost:8001/swagger/

# O usar curl para login rápido
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Paso 3: Crear tu Primer Evento
```bash
# 1. Crear tipo de evento
curl -X POST http://localhost:8001/api/tipos/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Reunión", "descripcion": "Reuniones de trabajo"}'

# 2. Crear escenario
curl -X POST http://localhost:8001/api/escenarios/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Sala 1", "ubicacion": "Piso 1", "capacidad": 20, "area": 30.0}'

# 3. Crear evento
curl -X POST http://localhost:8001/api/eventos/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Primer Evento",
    "descripcion": "Evento de prueba",
    "direccion": "Oficina principal",
    "fecha": "2025-12-31",
    "hora_inicio": "10:00:00",
    "hora_fin": "11:00:00",
    "cupo_maximo": 15,
    "cupo_disponible": 15,
    "encargado": "Admin User",
    "tipo": 1,
    "escenario": 1
  }'
```

---

## 🎯 Casos de Uso Comunes

### 📅 Planificación de Eventos Corporativos

**Escenario**: Organizar una conferencia trimestral
```bash
# 1. Verificar disponibilidad del auditorio principal
GET /api/escenarios/disponibles/?fecha=2025-03-15

# 2. Crear evento con múltiples equipamientos
POST /api/eventos/
{
  "titulo": "Conferencia Q1 2025",
  "fecha": "2025-03-15",
  "hora_inicio": "09:00:00",
  "hora_fin": "17:00:00",
  "cupo_maximo": 200,
  "escenario": 1,
  "equipamientos": [
    {"equipamiento_id": 1, "cantidad": 2, "descripcion": "Proyectores principales"},
    {"equipamiento_id": 2, "cantidad": 1, "descripcion": "Sistema de audio"}
  ]
}

# 3. Gestionar inscripciones masivas
POST /api/eventos/1/inscribir/  # Repetir según sea necesario
```

### 🏢 Gestión de Salas de Reuniones

**Escenario**: Reservas diarias de salas
```bash
# 1. Ver disponibilidad de todas las salas para hoy
GET /api/escenarios/disponibles/?fecha=2025-08-09

# 2. Crear reunión rápida
POST /api/eventos/
{
  "titulo": "Reunión de Equipo",
  "fecha": "2025-08-09",
  "hora_inicio": "14:00:00",
  "hora_fin": "15:00:00",
  "cupo_maximo": 8,
  "tipo": 2,
  "escenario": 3
}

# 3. Verificar ocupación de salas
GET /api/eventos/?fecha_inicio=2025-08-09&fecha_fin=2025-08-09
```

### 🎓 Gestión de Talleres Educativos

**Escenario**: Series de talleres con equipamiento especializado
```bash
# 1. Crear múltiples talleres con equipamiento compartido
POST /api/eventos/  # Workshop 1
POST /api/eventos/  # Workshop 2

# 2. Gestionar préstamos de equipamiento
GET /api/equipamientos-prestados/?devuelto=false

# 3. Marcar equipos como devueltos después de cada taller
POST /api/equipamientos-prestados/1/marcar_devuelto/
```

---

## 📞 Endpoints de Referencia Rápida

### 🔐 Autenticación (No requiere token)
```bash
POST /api/auth/register/     # Crear cuenta
POST /api/auth/login/        # Iniciar sesión
POST /api/token/             # Token directo JWT
POST /api/token/refresh/     # Renovar token
```

### 🎯 Endpoints Principales (Requieren token)
```bash
# CRUD Básico para cada recurso
GET    /api/{resource}/           # Listar todos
POST   /api/{resource}/           # Crear nuevo
GET    /api/{resource}/{id}/      # Obtener específico
PUT    /api/{resource}/{id}/      # Actualizar completo
PATCH  /api/{resource}/{id}/      # Actualizar parcial
DELETE /api/{resource}/{id}/      # Eliminar

# Recursos disponibles:
# - tipos, escenarios, equipamientos, eventos, equipamientos-prestados
```

### ⚡ Endpoints Especiales
```bash
# Eventos
GET  /api/eventos/proximos/              # Próximos eventos
GET  /api/eventos/estadisticas/          # Estadísticas generales
POST /api/eventos/{id}/inscribir/        # Inscribir al evento
POST /api/eventos/{id}/cancelar_inscripcion/  # Cancelar inscripción

# Escenarios
GET /api/escenarios/disponibles/         # Escenarios disponibles
GET /api/escenarios/{id}/eventos/        # Eventos del escenario

# Equipamientos
GET /api/equipamientos/{id}/prestamos/   # Préstamos del equipo

# Equipamientos Prestados
GET  /api/equipamientos-prestados/pendientes/     # Pendientes de devolución
POST /api/equipamientos-prestados/{id}/marcar_devuelto/   # Marcar devuelto
POST /api/equipamientos-prestados/{id}/marcar_prestado/   # Marcar prestado
```

---

## 🔧 Herramientas de Desarrollo

### 🧪 Script de Testing Incluido
```bash
# Ejecutar tests automáticos
python test_api.py
```

### 📊 Comandos útiles de Django
```bash
# Ver migraciones pendientes
python manage.py showmigrations

# Crear superusuario adicional
python manage.py createsuperuser

# Abrir shell de Django
python manage.py shell

# Recopilar archivos estáticos
python manage.py collectstatic

# Verificar configuración
python manage.py check
```

### 🐛 Debug y Logs
```bash
# Activar logs detallados (en settings.py)
DEBUG = True
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
```

---

## 🤝 Integración con Spring Boot

Este microservicio está diseñado para trabajar junto con el microservicio Spring Boot. Ambos comparten la misma base de datos PostgreSQL y pueden comunicarse a través de HTTP si es necesario.

### Comunicación entre Microservicios

- **Puerto Django**: 8001
- **Puerto Spring Boot**: 8080
- **Base de datos compartida**: PostgreSQL en puerto 5433

---

## 📝 Notas de Desarrollo

- El proyecto usa Django REST Framework para la API
- JWT para autenticación
- Swagger/OpenAPI para documentación
- CORS habilitado para desarrollo
- PostgreSQL como base de datos
- Docker para fácil despliegue

---

## 👥 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request
