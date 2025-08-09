"""
Ejemplo de integración entre microservicios Django y Spring Boot
================================================================

Este archivo muestra ejemplos prácticos de cómo integrar ambos microservicios
para crear un sistema completo de gestión de asistencias.
"""

import requests
import json
from datetime import datetime, timedelta

class MicroserviceIntegration:
    def __init__(self):
        self.django_base = "http://localhost:8001"
        self.spring_base = "http://localhost:8080"
        self.django_token = None
        self.spring_token = None
    
    def authenticate_both_services(self):
        """Autenticar en ambos microservicios"""
        
        # Autenticar en Django
        django_auth = {
            "username": "admin",
            "password": "admin123"
        }
        
        response = requests.post(f"{self.django_base}/api/auth/login/", json=django_auth)
        if response.status_code == 200:
            self.django_token = response.json()['access']
            print("✅ Autenticado en Django")
        
        # Autenticar en Spring Boot
        spring_auth = {
            "username": "admin",  # Ajustar según Spring Boot
            "password": "admin123"
        }
        
        try:
            response = requests.post(f"{self.spring_base}/auth/login", json=spring_auth)
            if response.status_code == 200:
                self.spring_token = response.json().get('jwt')
                print("✅ Autenticado en Spring Boot")
        except:
            print("⚠️  Spring Boot no disponible")
    
    def create_event_with_user_validation(self, event_data, user_email):
        """
        Crear evento en Django después de validar que el usuario existe en Spring Boot
        """
        
        # 1. Verificar usuario en Spring Boot
        spring_headers = {'Authorization': f'Bearer {self.spring_token}'}
        
        try:
            # Buscar usuario por email en Spring Boot
            user_response = requests.get(
                f"{self.spring_base}/cds/users", 
                headers=spring_headers,
                params={'email': user_email}
            )
            
            if user_response.status_code != 200:
                return {"error": "Usuario no encontrado en Spring Boot"}
            
            user_data = user_response.json()
            if not user_data:
                return {"error": "Usuario no existe"}
            
            print(f"✅ Usuario validado: {user_data[0]['name']}")
            
        except:
            print("⚠️  No se pudo validar usuario en Spring Boot, continuando...")
        
        # 2. Crear evento en Django
        django_headers = {'Authorization': f'Bearer {self.django_token}'}
        
        response = requests.post(
            f"{self.django_base}/api/eventos/",
            headers=django_headers,
            json=event_data
        )
        
        if response.status_code == 201:
            event = response.json()
            print(f"✅ Evento creado: {event['titulo']}")
            return event
        else:
            return {"error": "No se pudo crear evento", "details": response.text}
    
    def sync_user_attendance(self, event_id, person_id):
        """
        Sincronizar asistencia entre microservicios:
        1. Inscribir en evento (Django)
        2. Crear registro de asistencia (Spring Boot)
        """
        
        # 1. Inscribir en evento (Django)
        django_headers = {'Authorization': f'Bearer {self.django_token}'}
        
        response = requests.post(
            f"{self.django_base}/api/eventos/{event_id}/inscribir/",
            headers=django_headers
        )
        
        if response.status_code != 200:
            return {"error": "No se pudo inscribir en evento"}
        
        print("✅ Inscrito en evento Django")
        
        # 2. Crear registro en Spring Boot
        spring_headers = {'Authorization': f'Bearer {self.spring_token}'}
        
        registration_data = {
            "personId": person_id,
            "eventoId": event_id,
            "metodoRegistro": "EVENTO_DJANGO",
            "observaciones": f"Inscripción automática desde evento Django ID: {event_id}"
        }
        
        try:
            response = requests.post(
                f"{self.spring_base}/cds/registrations/create/{person_id}",
                headers=spring_headers,
                json=registration_data
            )
            
            if response.status_code == 201:
                print("✅ Registro creado en Spring Boot")
                return {"success": True, "django_inscripcion": True, "spring_registro": True}
            
        except:
            print("⚠️  No se pudo crear registro en Spring Boot")
            return {"success": True, "django_inscripcion": True, "spring_registro": False}
    
    def get_comprehensive_event_report(self, event_id):
        """
        Generar reporte completo combinando datos de ambos microservicios
        """
        
        # 1. Obtener datos del evento desde Django
        django_headers = {'Authorization': f'Bearer {self.django_token}'}
        
        event_response = requests.get(
            f"{self.django_base}/api/eventos/{event_id}/",
            headers=django_headers
        )
        
        if event_response.status_code != 200:
            return {"error": "Evento no encontrado"}
        
        event_data = event_response.json()
        
        # 2. Obtener registros de asistencia desde Spring Boot
        spring_headers = {'Authorization': f'Bearer {self.spring_token}'}
        
        try:
            registrations_response = requests.get(
                f"{self.spring_base}/cds/registrations",
                headers=spring_headers,
                params={'eventoId': event_id}
            )
            
            registrations = registrations_response.json() if registrations_response.status_code == 200 else []
            
        except:
            registrations = []
        
        # 3. Combinar información
        report = {
            "evento": {
                "id": event_data['id'],
                "titulo": event_data['titulo'],
                "fecha": event_data['fecha'],
                "cupo_maximo": event_data['cupo_maximo'],
                "cupo_disponible": event_data['cupo_disponible'],
                "encargado": event_data['encargado']
            },
            "asistencia": {
                "inscritos_django": event_data['cupo_maximo'] - event_data['cupo_disponible'],
                "registros_spring": len(registrations),
                "tasa_confirmacion": len(registrations) / max(1, event_data['cupo_maximo'] - event_data['cupo_disponible']) * 100
            },
            "equipamientos": event_data.get('equipamientos_prestados', [])
        }
        
        return report


def ejemplo_flujo_completo():
    """
    Ejemplo de flujo completo de integración
    """
    print("🚀 Iniciando flujo de integración completo")
    print("=" * 50)
    
    integration = MicroserviceIntegration()
    
    # 1. Autenticar en ambos servicios
    integration.authenticate_both_services()
    
    # 2. Crear evento con validación de usuario
    event_data = {
        "titulo": "Integración Workshop",
        "descripcion": "Taller de integración de microservicios",
        "direccion": "Sala de Conferencias",
        "fecha": "2025-12-20",
        "hora_inicio": "10:00:00",
        "hora_fin": "12:00:00",
        "cupo_maximo": 30,
        "cupo_disponible": 30,
        "encargado": "Admin User",
        "tipo": 1,
        "escenario": 1
    }
    
    event = integration.create_event_with_user_validation(event_data, "admin@example.com")
    
    if 'error' not in event:
        event_id = event['id']
        
        # 3. Simular inscripción con sincronización
        print("\n📝 Simulando inscripción...")
        result = integration.sync_user_attendance(event_id, 1)  # person_id = 1
        
        # 4. Generar reporte completo
        print("\n📊 Generando reporte completo...")
        report = integration.get_comprehensive_event_report(event_id)
        
        print(f"""
        📋 REPORTE DE EVENTO
        ==================
        Título: {report['evento']['titulo']}
        Fecha: {report['evento']['fecha']}
        Cupo Total: {report['evento']['cupo_maximo']}
        Inscritos Django: {report['asistencia']['inscritos_django']}
        Registros Spring: {report['asistencia']['registros_spring']}
        Tasa Confirmación: {report['asistencia']['tasa_confirmacion']:.1f}%
        """)
    
    print("🏁 Flujo completado")


if __name__ == "__main__":
    ejemplo_flujo_completo()
