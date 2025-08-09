from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Crear el router para las ViewSets
router = DefaultRouter()
router.register(r'tipos', views.TipoViewSet)
router.register(r'escenarios', views.EscenarioViewSet)
router.register(r'equipamientos', views.EquipamientoViewSet)
router.register(r'eventos', views.EventoViewSet)
router.register(r'evento-escenarios', views.EventoEscenarioViewSet)
router.register(r'equipamientos-prestados', views.EquipamientoPrestadoViewSet)

app_name = 'events'

urlpatterns = [
    path('api/', include(router.urls)),
]
