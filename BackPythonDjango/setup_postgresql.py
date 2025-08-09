"""
Script para detectar y configurar automáticamente PostgreSQL
Este script ayuda a encontrar la configuración correcta para tu instalación local
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, capture_output=True):
    """Ejecutar comando y capturar salida"""
    try:
        result = subprocess.run(command, capture_output=capture_output, text=True, shell=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def detect_postgresql():
    """Detectar instalación de PostgreSQL"""
    print("🔍 Detectando PostgreSQL en el sistema...")
    print("-" * 40)
    
    # Verificar si psql está disponible
    success, stdout, stderr = run_command("psql --version")
    if success:
        print(f"✅ PostgreSQL CLI encontrado: {stdout.strip()}")
        
        # Intentar conectar con diferentes usuarios comunes
        common_users = ["postgres", os.getenv("USERNAME"), "admin"]
        
        for user in common_users:
            print(f"\n🔑 Probando conexión con usuario: {user}")
            
            # Probar conexión sin contraseña (trust mode)
            cmd = f'psql -U {user} -h localhost -c "SELECT version();" 2>nul'
            success, stdout, stderr = run_command(cmd)
            
            if success and "PostgreSQL" in stdout:
                print(f"✅ Conexión exitosa con usuario: {user}")
                print(f"📋 Versión: {stdout.split('PostgreSQL')[1].split('on')[0].strip()}")
                return user, True
            else:
                print(f"❌ Falló conexión con {user}")
    
    else:
        print("❌ PostgreSQL CLI no encontrado en PATH")
        
        # Buscar instalaciones comunes de PostgreSQL
        common_paths = [
            "C:\\Program Files\\PostgreSQL\\",
            "C:\\Program Files (x86)\\PostgreSQL\\",
            "C:\\PostgreSQL\\",
        ]
        
        for path in common_paths:
            if os.path.exists(path):
                print(f"📁 Instalación PostgreSQL encontrada en: {path}")
                
                # Buscar versiones
                for item in os.listdir(path):
                    version_path = os.path.join(path, item)
                    if os.path.isdir(version_path):
                        bin_path = os.path.join(version_path, "bin")
                        if os.path.exists(bin_path):
                            print(f"   📂 Versión encontrada: {item}")
                            print(f"   🔧 Binarios en: {bin_path}")
                            print(f"   💡 Agregar a PATH: {bin_path}")
                            return None, False
    
    return None, False

def check_database_exists(user, db_name="asistencia"):
    """Verificar si la base de datos existe"""
    print(f"\n📊 Verificando base de datos '{db_name}'...")
    
    cmd = f'psql -U {user} -h localhost -lqt'
    success, stdout, stderr = run_command(cmd)
    
    if success:
        databases = [line.split('|')[0].strip() for line in stdout.split('\n') if '|' in line]
        
        if db_name in databases:
            print(f"✅ Base de datos '{db_name}' existe")
            return True
        else:
            print(f"❌ Base de datos '{db_name}' no existe")
            print("📋 Bases de datos disponibles:")
            for db in databases:
                if db and db not in ['template0', 'template1']:
                    print(f"   - {db}")
            return False
    else:
        print(f"❌ Error al listar bases de datos: {stderr}")
        return False

def create_database(user, db_name="asistencia"):
    """Crear base de datos"""
    print(f"\n🔨 Creando base de datos '{db_name}'...")
    
    cmd = f'psql -U {user} -h localhost -c "CREATE DATABASE {db_name};"'
    success, stdout, stderr = run_command(cmd)
    
    if success:
        print(f"✅ Base de datos '{db_name}' creada exitosamente")
        return True
    else:
        if "already exists" in stderr:
            print(f"⚠️  Base de datos '{db_name}' ya existe")
            return True
        else:
            print(f"❌ Error al crear base de datos: {stderr}")
            return False

def update_env_file(user, password="", db_name="asistencia", host="localhost", port="5432"):
    """Actualizar archivo .env con configuración detectada"""
    print(f"\n📝 Actualizando archivo .env...")
    
    env_content = f"""# Database configuration
DB_NAME={db_name}
DB_USER={user}
DB_PASSWORD={password}
DB_HOST={host}
DB_PORT={port}

# Django configuration
SECRET_KEY=ZXN0ZUVzVW5TZWNyZXRvU3VwZXJMYXJnb1lTZWd1cm8xMjM0UHl0aG9uRGphbmdv
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# CORS configuration
CORS_ALLOW_ALL_ORIGINS=True
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        
        print("✅ Archivo .env actualizado exitosamente")
        print(f"   🔑 Usuario: {user}")
        print(f"   📊 Base de datos: {db_name}")
        print(f"   🌐 Host: {host}:{port}")
        return True
    except Exception as e:
        print(f"❌ Error al actualizar .env: {e}")
        return False

def test_django_connection():
    """Probar conexión con Django"""
    print(f"\n🧪 Probando conexión con Django...")
    
    cmd = "python test_postgresql_connection.py"
    success, stdout, stderr = run_command(cmd, capture_output=False)
    
    return success

def main():
    """Función principal"""
    print("🐘 PostgreSQL Auto-Configuration Tool")
    print("=" * 50)
    
    # 1. Detectar PostgreSQL
    user, connected = detect_postgresql()
    
    if not connected:
        print("\n❌ No se pudo conectar automáticamente a PostgreSQL")
        print("\n💡 Opciones:")
        print("1. Instalar PostgreSQL si no está instalado")
        print("2. Configurar PATH para incluir binarios de PostgreSQL")
        print("3. Usar pgAdmin para configurar usuario y contraseña")
        print("4. Configurar modo trust en pg_hba.conf temporalmente")
        return
    
    # 2. Verificar/crear base de datos
    if not check_database_exists(user):
        create_db = input(f"\n¿Crear base de datos 'asistencia'? (y/N): ").lower()
        if create_db == 'y':
            if not create_database(user):
                return
    
    # 3. Solicitar contraseña si es necesario
    print(f"\n🔐 Configuración de usuario '{user}':")
    password = input("Ingresa la contraseña (deja vacío si no usa contraseña): ").strip()
    
    # 4. Actualizar .env
    if update_env_file(user, password):
        # 5. Probar conexión final
        if test_django_connection():
            print("\n🎉 ¡Configuración completada exitosamente!")
            print("\n📋 Próximos pasos:")
            print("1. python manage.py migrate")
            print("2. python manage.py createsuperuser")
            print("3. python manage.py runserver 0.0.0.0:8001")
        else:
            print("\n⚠️  Configuración guardada pero conexión aún falla")
            print("Revisar credenciales manualmente en el archivo .env")

if __name__ == "__main__":
    main()
