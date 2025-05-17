# 📋 API de Asistencia - CDS

Este proyecto es una API REST desarrollada con **Spring Boot** para gestionar personas, usuarios, posiciones y registros de asistencia en una institución.

---

## 🚀 Levantar el proyecto con Docker

### Prerrequisitos:

- Tener instalado [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

### Comando para levantar la aplicación:

```bash
docker-compose up --build


🧪 Acceso a Swagger
Una vez que el proyecto esté corriendo, puedes acceder a la documentación interactiva generada por Swagger en:

📍 http://localhost:8080/swagger-ui/index.html

Desde ahí puedes ver y probar todas las rutas de la API directamente desde el navegador.

📂 Rutas de la API
📍 /cds/persons – Controlador de Personas
Método	Endpoint	Descripción
GET	/cds/persons	Listar todas las personas
GET	/cds/persons/{id}	Obtener una persona por su ID
POST	/cds/persons	Crear una nueva persona
PUT	/cds/persons/{id}	Actualizar una persona existente
DELETE	/cds/persons/{id}	Eliminar una persona

📍 /cds/positions – Controlador de Posiciones
Método	Endpoint	Descripción
GET	/cds/positions	Listar todas las posiciones
POST	/cds/positions/post	Crear una nueva posición
DELETE	/cds/positions/{id}	Eliminar una posición por su ID

📍 /cds/users – Controlador de Usuarios
Método	Endpoint	Descripción
GET	/cds/users	Listar todos los usuarios
GET	/cds/users/{id}	Obtener usuario por ID
GET	/cds/users/position/{position_id}	Obtener usuarios por posición
PUT	/cds/users/{id}	Actualizar datos de un usuario
PUT	/cds/users/role/{user_id}	Actualizar el rol de un usuario
PUT	/cds/users/position/{user_id}/{position_id}	Cambiar la posición de un usuario
DELETE	/cds/users/{id}	Eliminar un usuario

📍 /cds/registrations – Controlador de Registraciones
Método	Endpoint	Descripción
GET	/cds/registrations	Listar todas las registraciones
POST	/cds/registrations/create/{personId}	Crear una nueva registración para una persona
PATCH	/cds/registrations/{registrationId}/attendence?attendence=true	Actualizar asistencia
DELETE	/cds/registrations/{id}	Eliminar una registración

🧱 Estructura del proyecto
pgsql
Copiar
Editar
├── app
│   ├── controllers
│   │   ├── PersonController.java
│   │   ├── PositionController.java
│   │   ├── RegistrationController.java
│   │   └── UserController.java
│   ├── domain
│   │   ├── dto
│   │   ├── entities
│   ├── services
│   ├── mappers
│   ├── util
├── resources
│   ├── application.yml
├── Dockerfile
├── docker-compose.yml
└── README.md

🔧 Tecnologías usadas

Java 17

Spring Boot

Spring Data JPA

PostgreSQL

Docker & Docker Compose

Swagger / OpenAPI