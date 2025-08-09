# 🚀 Job Management API - Guía Rápida

## 🔗 URLs Principales
- **API Base**: http://localhost:8001
- **Swagger**: http://localhost:8001/swagger/
- **Admin**: http://localhost:8001/admin/
- **ReDoc**: http://localhost:8001/redoc/

## 🔐 Autenticación Rápida
```bash
# Login Admin (usuario por defecto)
POST /api/auth/login/
{
  "username": "admin",
  "password": "admin123"
}
```

## ⚡ Endpoints Esenciales

### 📋 Gestión Básica
| Recurso | GET (Listar) | POST (Crear) | GET (Ver) | PUT (Actualizar) | DELETE |
|---------|--------------|--------------|-----------|------------------|--------|
| Tipos | `/api/tipos/` | `/api/tipos/` | `/api/tipos/{id}/` | `/api/tipos/{id}/` | `/api/tipos/{id}/` |
| Escenarios | `/api/escenarios/` | `/api/escenarios/` | `/api/escenarios/{id}/` | `/api/escenarios/{id}/` | `/api/escenarios/{id}/` |
| Equipamientos | `/api/equipamientos/` | `/api/equipamientos/` | `/api/equipamientos/{id}/` | `/api/equipamientos/{id}/` | `/api/equipamientos/{id}/` |
| Eventos | `/api/eventos/` | `/api/eventos/` | `/api/eventos/{id}/` | `/api/eventos/{id}/` | `/api/eventos/{id}/` |

### 🎯 Acciones Especiales
```bash
# Eventos
POST /api/eventos/{id}/inscribir/                    # Inscribir persona
POST /api/eventos/{id}/cancelar_inscripcion/         # Cancelar inscripción
GET  /api/eventos/proximos/                          # Eventos próximos
GET  /api/eventos/estadisticas/                      # Estadísticas

# Escenarios
GET /api/escenarios/disponibles/?fecha=YYYY-MM-DD   # Disponibilidad
GET /api/escenarios/{id}/eventos/                   # Eventos del escenario

# Equipamientos Prestados
GET  /api/equipamientos-prestados/pendientes/       # Pendientes devolución
POST /api/equipamientos-prestados/{id}/marcar_devuelto/  # Marcar devuelto
```

## 🔍 Filtros Útiles

### Eventos
```bash
GET /api/eventos/?fecha_inicio=2025-01-01&fecha_fin=2025-12-31  # Por rango de fechas
GET /api/eventos/?tipo=1&escenario=2                           # Por tipo y escenario
GET /api/eventos/?disponibles=true                             # Solo con cupos
GET /api/eventos/?search=conferencia                           # Búsqueda de texto
GET /api/eventos/?ordering=-fecha                              # Ordenar por fecha desc
```

### Escenarios
```bash
GET /api/escenarios/?search=auditorio              # Buscar por nombre
GET /api/escenarios/?ordering=-capacidad           # Ordenar por capacidad
```

## 📝 Ejemplos de Datos

### Crear Tipo de Evento
```json
{
  "nombre": "Conferencia",
  "descripcion": "Eventos de conferencias profesionales"
}
```

### Crear Escenario
```json
{
  "nombre": "Auditorio Principal",
  "ubicacion": "Edificio A - Piso 2",
  "descripcion": "Auditorio principal con alta capacidad",
  "capacidad": 200,
  "area": 150.50
}
```

### Crear Evento
```json
{
  "titulo": "Conferencia Tech 2025",
  "descripcion": "Conferencia sobre tecnología",
  "direccion": "Centro de Convenciones",
  "fecha": "2025-12-15",
  "hora_inicio": "09:00:00",
  "hora_fin": "17:00:00",
  "cupo_maximo": 150,
  "cupo_disponible": 150,
  "encargado": "Juan Pérez",
  "tipo": 1,
  "escenario": 1
}
```

## 🚨 Códigos de Estado
- **200**: ✅ Éxito
- **201**: ✅ Creado
- **400**: ❌ Error de validación
- **401**: ❌ Token inválido/expirado
- **404**: ❌ Recurso no encontrado
- **500**: ❌ Error del servidor

## 🔧 Comandos de Desarrollo
```bash
# Iniciar servidor
python manage.py runserver 0.0.0.0:8001

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Probar API
python test_api.py
```

## 📞 Headers Requeridos
```bash
# Para autenticación
Authorization: Bearer <your_jwt_token>

# Para envío de datos
Content-Type: application/json
```

## 🎯 Flujo Típico
1. **Login** → Obtener token
2. **Crear tipos** → Configurar categorías
3. **Crear escenarios** → Configurar espacios
4. **Crear equipamientos** → Configurar inventario
5. **Crear eventos** → Gestionar eventos
6. **Gestionar inscripciones** → Control de asistentes
7. **Monitorear estadísticas** → Seguimiento
