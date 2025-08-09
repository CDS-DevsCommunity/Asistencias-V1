#!/bin/bash

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté lista..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
  echo "La base de datos no está lista. Esperando..."
  sleep 2
done

echo "Base de datos lista. Ejecutando migraciones..."

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario si no existe
echo "Creando superusuario..."
python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuario creado: admin/admin123')
else:
    print('Superusuario ya existe')
EOF

# Ejecutar el servidor
echo "Iniciando servidor Django..."
python manage.py runserver 0.0.0.0:8000
