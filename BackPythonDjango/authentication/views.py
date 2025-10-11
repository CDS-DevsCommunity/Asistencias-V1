from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer, TokenSerializer,
    CargoSerializer, PersonaSerializer, PermisoSerializer, RolSerializer, RolPermisoSerializer
)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Persona, Cargo


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    permission_classes = [IsAuthenticated]


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.select_related('user', 'cargo').all()
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]


# Permiso y Rol
from .models import Permiso, Rol, RolPermiso


class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer
    permission_classes = [IsAuthenticated]


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.prefetch_related('permisos').all()
    serializer_class = RolSerializer
    permission_classes = [IsAuthenticated]


class RolPermisoViewSet(viewsets.ModelViewSet):
    queryset = RolPermiso.objects.select_related('rol', 'permiso').all()
    serializer_class = RolPermisoSerializer
    permission_classes = [IsAuthenticated]


@swagger_auto_schema(
    method='post',
    request_body=UserRegistrationSerializer,
    responses={
        201: openapi.Response('Usuario creado exitosamente', TokenSerializer),
        400: 'Error de validación'
    },
    operation_description="Registrar un nuevo usuario en el sistema"
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Registro de nuevos usuarios"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Usuario registrado exitosamente'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=UserLoginSerializer,
    responses={
        200: openapi.Response('Login exitoso', TokenSerializer),
        400: 'Credenciales inválidas'
    },
    operation_description="Iniciar sesión en el sistema"
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Inicio de sesión"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login exitoso'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token')
        }
    ),
    responses={
        205: 'Logout exitoso',
        400: 'Error en el logout'
    },
    operation_description="Cerrar sesión y invalidar tokens"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Cerrar sesión"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout exitoso'
        }, status=status.HTTP_205_RESET_CONTENT)
    
    except Exception as e:
        return Response({
            'error': 'Error al cerrar sesión'
        }, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response('Información del usuario', UserSerializer),
    },
    operation_description="Obtener información del usuario autenticado"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Obtener perfil del usuario autenticado"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@swagger_auto_schema(
    method='put',
    request_body=UserSerializer,
    responses={
        200: openapi.Response('Usuario actualizado', UserSerializer),
        400: 'Error de validación'
    },
    operation_description="Actualizar información del usuario autenticado"
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Actualizar perfil del usuario autenticado"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    responses={
        200: 'Token válido',
        401: 'Token inválido'
    },
    operation_description="Verificar si el token JWT es válido"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """Verificar validez del token"""
    return Response({
        'valid': True,
        'user': UserSerializer(request.user).data
    })
