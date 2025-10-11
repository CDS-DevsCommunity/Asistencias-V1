from rest_framework import viewsets, permissions
from .models import Tipo, Escenario, Equipamiento, Evento, EventoEscenario, EquipamientoPrestado, Inscripcion, Equipo, Voluntario
from rest_framework import serializers
from .serializers import (
    TipoSerializer, EscenarioSerializer, EquipamientoSerializer,
    EventoSerializer, EventoEscenarioSerializer, EquipamientoPrestadoSerializer,
    InscripcionSerializer, EquipoSerializer, VoluntarioSerializer,
    EventoCreateSerializer, EventoUpdateSerializer, EventoListSerializer
)


class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.select_related('persona', 'evento').all()
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Si el cliente envía persona, se usará; sino, intentar usar persona asociada al user
        persona = None
        persona_id = self.request.data.get('persona') or self.request.data.get('persona_id')
        if persona_id:
            try:
                from authentication.models import Persona
                persona = Persona.objects.get(pk=int(persona_id))
            except Exception:
                persona = None

        # Intentamos asociar persona del usuario autenticado si existe
        if not persona and hasattr(self.request.user, 'persona'):
            persona = self.request.user.persona

        if persona:
            serializer.save(persona=persona)
        else:
            raise serializers.ValidationError('Persona no encontrada o no especificada')


from rest_framework import status


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.select_related('evento').all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticated]


class VoluntarioViewSet(viewsets.ModelViewSet):
    queryset = Voluntario.objects.select_related('usuario', 'equipo').all()
    serializer_class = VoluntarioSerializer
    permission_classes = [permissions.IsAuthenticated]

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.utils import timezone
from datetime import datetime

from .models import Tipo, Escenario, Equipamiento, Evento, EventoEscenario, EquipamientoPrestado
from .serializers import (
    TipoSerializer, EscenarioSerializer, EquipamientoSerializer,
    EventoSerializer, EventoCreateSerializer, EventoUpdateSerializer,
    EventoListSerializer, EventoEscenarioSerializer, EquipamientoPrestadoSerializer
)


class TipoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de tipos de eventos"""
    queryset = Tipo.objects.all()
    serializer_class = TipoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'created_at']
    ordering = ['nombre']


class EscenarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de escenarios"""
    queryset = Escenario.objects.all()
    serializer_class = EscenarioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'ubicacion', 'descripcion']
    ordering_fields = ['nombre', 'capacidad', 'created_at']
    ordering = ['nombre']

    @action(detail=True, methods=['get'])
    def eventos(self, request, pk=None):
        """Obtener eventos de un escenario específico"""
        escenario = self.get_object()
        eventos = Evento.objects.filter(escenario=escenario)
        serializer = EventoListSerializer(eventos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtener escenarios disponibles para una fecha específica"""
        fecha = request.query_params.get('fecha')
        if not fecha:
            return Response(
                {'error': 'Parámetro fecha es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Escenarios que no tienen eventos en esa fecha
        escenarios_ocupados = Evento.objects.filter(fecha=fecha_obj).values_list('escenario', flat=True)
        escenarios_disponibles = Escenario.objects.exclude(id__in=escenarios_ocupados)
        
        serializer = self.get_serializer(escenarios_disponibles, many=True)
        return Response(serializer.data)


class EquipamientoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de equipamientos"""
    queryset = Equipamiento.objects.all()
    serializer_class = EquipamientoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre', 'created_at']
    ordering = ['nombre']

    @action(detail=True, methods=['get'])
    def prestamos(self, request, pk=None):
        """Obtener préstamos de un equipamiento específico"""
        equipamiento = self.get_object()
        prestamos = EquipamientoPrestado.objects.filter(equipamiento=equipamiento)
        serializer = EquipamientoPrestadoSerializer(prestamos, many=True)
        return Response(serializer.data)


class EventoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de eventos"""
    queryset = Evento.objects.all().select_related('tipo', 'escenario').prefetch_related(
        'equipamientos_prestados__equipamiento', 'evento_escenarios__escenario'
    )
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'encargado']
    ordering_fields = ['fecha', 'hora_inicio', 'titulo', 'created_at']
    ordering = ['-fecha', '-hora_inicio']

    def get_serializer_class(self):
        if self.action == 'create':
            return EventoCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return EventoUpdateSerializer
        elif self.action == 'list':
            return EventoListSerializer
        return EventoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros adicionales
        fecha_inicio = self.request.query_params.get('fecha_inicio')
        fecha_fin = self.request.query_params.get('fecha_fin')
        tipo_id = self.request.query_params.get('tipo')
        escenario_id = self.request.query_params.get('escenario')
        disponibles = self.request.query_params.get('disponibles')
        
        if fecha_inicio:
            try:
                fecha_inicio_obj = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                queryset = queryset.filter(fecha__gte=fecha_inicio_obj)
            except ValueError:
                pass
        
        if fecha_fin:
            try:
                fecha_fin_obj = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                queryset = queryset.filter(fecha__lte=fecha_fin_obj)
            except ValueError:
                pass
        
        if tipo_id:
            queryset = queryset.filter(tipo_id=tipo_id)
        
        if escenario_id:
            queryset = queryset.filter(escenario_id=escenario_id)
        
        if disponibles == 'true':
            queryset = queryset.filter(cupo_disponible__gt=0)
        elif disponibles == 'false':
            queryset = queryset.filter(cupo_disponible=0)
        
        return queryset

    @action(detail=True, methods=['post'])
    def inscribir(self, request, pk=None):
        """Inscribir una persona al evento"""
        evento = self.get_object()
        
        if evento.cupo_disponible <= 0:
            return Response(
                {'error': 'No hay cupos disponibles para este evento'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reducir cupo disponible
        evento.cupo_disponible -= 1
        evento.save()
        
        return Response({
            'message': 'Inscripción exitosa',
            'cupo_disponible': evento.cupo_disponible
        })

    @action(detail=True, methods=['post'])
    def cancelar_inscripcion(self, request, pk=None):
        """Cancelar inscripción de una persona al evento"""
        evento = self.get_object()
        
        if evento.cupo_disponible >= evento.cupo_maximo:
            return Response(
                {'error': 'No hay inscripciones que cancelar'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Aumentar cupo disponible
        evento.cupo_disponible += 1
        evento.save()
        
        return Response({
            'message': 'Cancelación exitosa',
            'cupo_disponible': evento.cupo_disponible
        })

    @action(detail=False, methods=['get'])
    def proximos(self, request):
        """Obtener eventos próximos"""
        hoy = timezone.now().date()
        eventos_proximos = self.get_queryset().filter(fecha__gte=hoy)[:10]
        serializer = EventoListSerializer(eventos_proximos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas generales de eventos"""
        queryset = self.get_queryset()
        
        total_eventos = queryset.count()
        eventos_llenos = queryset.filter(cupo_disponible=0).count()
        eventos_disponibles = queryset.filter(cupo_disponible__gt=0).count()
        
        # Calcular ocupación promedio
        total_cupos = sum(e.cupo_maximo for e in queryset)
        cupos_ocupados = sum(e.cupo_maximo - e.cupo_disponible for e in queryset)
        ocupacion_promedio = (cupos_ocupados / total_cupos * 100) if total_cupos > 0 else 0
        
        return Response({
            'total_eventos': total_eventos,
            'eventos_llenos': eventos_llenos,
            'eventos_disponibles': eventos_disponibles,
            'ocupacion_promedio': round(ocupacion_promedio, 2)
        })


class EventoEscenarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de relaciones evento-escenario"""
    queryset = EventoEscenario.objects.all().select_related('evento', 'escenario')
    serializer_class = EventoEscenarioSerializer
    permission_classes = [IsAuthenticated]


class EquipamientoPrestadoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de equipamientos prestados"""
    queryset = EquipamientoPrestado.objects.all().select_related('equipamiento', 'evento')
    serializer_class = EquipamientoPrestadoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['equipamiento__nombre', 'evento__titulo']
    ordering_fields = ['created_at', 'devuelto']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros adicionales
        devuelto = self.request.query_params.get('devuelto')
        evento_id = self.request.query_params.get('evento')
        equipamiento_id = self.request.query_params.get('equipamiento')
        
        if devuelto is not None:
            queryset = queryset.filter(devuelto=devuelto.lower() == 'true')
        
        if evento_id:
            queryset = queryset.filter(evento_id=evento_id)
        
        if equipamiento_id:
            queryset = queryset.filter(equipamiento_id=equipamiento_id)
        
        return queryset

    @action(detail=True, methods=['post'])
    def marcar_devuelto(self, request, pk=None):
        """Marcar equipamiento como devuelto"""
        prestamo = self.get_object()
        prestamo.devuelto = True
        prestamo.save()
        
        serializer = self.get_serializer(prestamo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def marcar_prestado(self, request, pk=None):
        """Marcar equipamiento como prestado (no devuelto)"""
        prestamo = self.get_object()
        prestamo.devuelto = False
        prestamo.save()
        
        serializer = self.get_serializer(prestamo)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Obtener equipamientos pendientes de devolución"""
        prestamos_pendientes = self.get_queryset().filter(devuelto=False)
        serializer = self.get_serializer(prestamos_pendientes, many=True)
        return Response(serializer.data)
