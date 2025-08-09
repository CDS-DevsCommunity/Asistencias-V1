#!/usr/bin/env python
"""
Script para probar la conexión a PostgreSQL
Utiliza las mismas configuraciones del archivo .env
"""

import os
import django
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_management.settings')

try:
    django.setup()
    from django.db import connection
    from django.core.management.color import make_style
    
    style = make_style()
    
    def test_database_connection():
        """Probar conexión a la base de datos"""
        try:
            print(style.HTTP_INFO("🔍 Probando conexión a PostgreSQL..."))
            print("-" * 50)
            
            # Obtener información de la configuración
            db_config = connection.settings_dict
            print(f"📊 Configuración de base de datos:")
            print(f"   • Motor: {db_config['ENGINE']}")
            print(f"   • Base de datos: {db_config['NAME']}")
            print(f"   • Usuario: {db_config['USER']}")
            print(f"   • Host: {db_config['HOST']}")
            print(f"   • Puerto: {db_config['PORT']}")
            print()
            
            # Probar conexión
            with connection.cursor() as cursor:
                cursor.execute("SELECT version()")
                version = cursor.fetchone()
                print(style.SUCCESS("✅ Conexión exitosa!"))
                print(f"   PostgreSQL Version: {version[0]}")
                print()
                
                # Verificar base de datos
                cursor.execute("SELECT current_database()")
                current_db = cursor.fetchone()
                print(f"   📋 Base de datos actual: {current_db[0]}")
                
                # Verificar tablas de Django
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                    ORDER BY table_name
                """)
                tables = cursor.fetchall()
                
                if tables:
                    print(f"   📚 Tablas existentes ({len(tables)}):")
                    for table in tables:
                        print(f"      - {table[0]}")
                else:
                    print(style.WARNING("   ⚠️  No se encontraron tablas. Puede que necesites ejecutar migraciones."))
                
                print()
                return True
                
        except Exception as e:
            print(style.ERROR("❌ Error de conexión:"))
            print(f"   {str(e)}")
            print()
            
            # Sugerencias de solución
            print(style.HTTP_INFO("🔧 Posibles soluciones:"))
            print("   1. Verificar que PostgreSQL esté ejecutándose")
            print("   2. Revisar las credenciales en el archivo .env")
            print("   3. Confirmar que la base de datos 'asistencia' existe")
            print("   4. Verificar que el puerto 5433 esté disponible")
            print("   5. Comprobar permisos de usuario en PostgreSQL")
            print()
            return False

    def show_env_config():
        """Mostrar configuración del archivo .env"""
        print(style.HTTP_INFO("📄 Configuración desde .env:"))
        print("-" * 30)
        
        env_file = BASE_DIR / '.env'
        if env_file.exists():
            with open(env_file, 'r') as f:
                lines = f.readlines()
                
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#') and 'DB_' in line:
                    if 'PASSWORD' in line:
                        # Ocultar contraseña
                        key, value = line.split('=', 1)
                        print(f"   {key}=***")
                    else:
                        print(f"   {line}")
        else:
            print(style.ERROR("   ❌ Archivo .env no encontrado"))
        print()

    if __name__ == "__main__":
        print(style.HTTP_INFO("🐘 PostgreSQL Connection Test"))
        print("=" * 50)
        print()
        
        show_env_config()
        success = test_database_connection()
        
        if success:
            print(style.SUCCESS("🎉 ¡Conexión a PostgreSQL configurada correctamente!"))
            print()
            print(style.HTTP_INFO("📋 Siguientes pasos:"))
            print("   1. Ejecutar migraciones: python manage.py migrate")
            print("   2. Crear superusuario: python manage.py createsuperuser")
            print("   3. Iniciar servidor: python manage.py runserver")
        else:
            print(style.ERROR("💥 Conexión fallida. Revisar configuración."))
            
except ImportError as e:
    print(f"❌ Error de importación: {e}")
    print("Asegúrate de que Django y las dependencias estén instaladas.")
except Exception as e:
    print(f"❌ Error general: {e}")
