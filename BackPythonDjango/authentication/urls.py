from django.urls import path, include
from . import views

app_name = 'authentication'

urlpatterns = [
    path('api/auth/register/', views.register, name='register'),
    path('api/auth/login/', views.login, name='login'),
    path('api/auth/logout/', views.logout, name='logout'),
    path('api/auth/profile/', views.user_profile, name='user_profile'),
    path('api/auth/profile/update/', views.update_profile, name='update_profile'),
    path('api/auth/verify/', views.verify_token, name='verify_token'),
]

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cargos', views.CargoViewSet, basename='cargos')
router.register(r'personas', views.PersonaViewSet, basename='personas')
router.register(r'permisos', views.PermisoViewSet, basename='permisos')
router.register(r'roles', views.RolViewSet, basename='roles')
router.register(r'rol-permisos', views.RolPermisoViewSet, basename='rol-permisos')

urlpatterns += [
    path('api/', include(router.urls)),
]
