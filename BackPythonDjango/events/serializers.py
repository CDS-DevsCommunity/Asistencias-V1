from rest_framework import serializers
from .models import Tipo, Escenario, Equipamiento, Evento, EventoEscenario, EquipamientoPrestado


class TipoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Tipo"""
    
    class Meta:
        model = Tipo
        fields = ['id', 'nombre', 'descripcion', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EscenarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Escenario"""
    
    class Meta:
        model = Escenario
        fields = [
            'id', 'nombre', 'ubicacion', 'descripcion', 
            'capacidad', 'area', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_capacidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La capacidad debe ser mayor a 0")
        return value

    def validate_area(self, value):
        if value <= 0:
            raise serializers.ValidationError("El área debe ser mayor a 0")
        return value


class EquipamientoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Equipamiento"""
    
    class Meta:
        model = Equipamiento
        fields = ['id', 'nombre', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EquipamientoPrestadoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo EquipamientoPrestado"""
    equipamiento_nombre = serializers.CharField(source='equipamiento.nombre', read_only=True)
    evento_titulo = serializers.CharField(source='evento.titulo', read_only=True)
    
    class Meta:
        model = EquipamientoPrestado
        fields = [
            'id', 'cantidad', 'devuelto', 'descripcion',
            'equipamiento', 'equipamiento_nombre',
            'evento', 'evento_titulo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value


class EventoEscenarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo EventoEscenario"""
    escenario_nombre = serializers.CharField(source='escenario.nombre', read_only=True)
    evento_titulo = serializers.CharField(source='evento.titulo', read_only=True)
    
    class Meta:
        model = EventoEscenario
        fields = [
            'id', 'uso_capacidad', 'hora_inicio', 'hora_fin',
            'evento', 'evento_titulo',
            'escenario', 'escenario_nombre',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        if data.get('hora_fin') and data.get('hora_inicio'):
            if data['hora_fin'] <= data['hora_inicio']:
                raise serializers.ValidationError(
                    "La hora de fin debe ser posterior a la hora de inicio"
                )
        return data

    def validate_uso_capacidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("El uso de capacidad debe ser mayor a 0")
        return value


class EventoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Evento"""
    tipo_nombre = serializers.CharField(source='tipo.nombre', read_only=True)
    escenario_nombre = serializers.CharField(source='escenario.nombre', read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    attendance_percentage = serializers.FloatField(read_only=True)
    equipamientos_prestados = EquipamientoPrestadoSerializer(many=True, read_only=True)
    evento_escenarios = EventoEscenarioSerializer(many=True, read_only=True)
    
    class Meta:
        model = Evento
        fields = [
            'id', 'titulo', 'descripcion', 'direccion', 'fecha',
            'hora_inicio', 'hora_fin', 'cupo_maximo', 'cupo_disponible',
            'encargado', 'imagen', 'tipo', 'tipo_nombre',
            'escenario', 'escenario_nombre', 'is_full', 'attendance_percentage',
            'equipamientos_prestados', 'evento_escenarios',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_full', 'attendance_percentage', 'created_at', 'updated_at']

    def validate(self, data):
        if data.get('hora_fin') and data.get('hora_inicio'):
            if data['hora_fin'] <= data['hora_inicio']:
                raise serializers.ValidationError(
                    "La hora de fin debe ser posterior a la hora de inicio"
                )
        
        if data.get('cupo_disponible') and data.get('cupo_maximo'):
            if data['cupo_disponible'] > data['cupo_maximo']:
                raise serializers.ValidationError(
                    "El cupo disponible no puede ser mayor al cupo máximo"
                )
        
        return data

    def validate_cupo_maximo(self, value):
        if value <= 0:
            raise serializers.ValidationError("El cupo máximo debe ser mayor a 0")
        return value

    def validate_cupo_disponible(self, value):
        if value < 0:
            raise serializers.ValidationError("El cupo disponible no puede ser negativo")
        return value


class EventoCreateSerializer(EventoSerializer):
    """Serializer específico para la creación de eventos"""
    equipamientos = serializers.ListField(
        child=serializers.DictField(), 
        write_only=True, 
        required=False
    )
    
    class Meta(EventoSerializer.Meta):
        fields = EventoSerializer.Meta.fields + ['equipamientos']

    def create(self, validated_data):
        equipamientos_data = validated_data.pop('equipamientos', [])
        evento = Evento.objects.create(**validated_data)
        
        # Crear equipamientos prestados
        for equip_data in equipamientos_data:
            EquipamientoPrestado.objects.create(
                evento=evento,
                equipamiento_id=equip_data['equipamiento_id'],
                cantidad=equip_data['cantidad'],
                descripcion=equip_data.get('descripcion', '')
            )
        
        return evento


class EventoUpdateSerializer(EventoSerializer):
    """Serializer específico para la actualización de eventos"""
    
    class Meta(EventoSerializer.Meta):
        pass

    def update(self, instance, validated_data):
        # Actualizar campos básicos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# Serializer específico para listado con menos información
class EventoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listado de eventos"""
    tipo_nombre = serializers.CharField(source='tipo.nombre', read_only=True)
    escenario_nombre = serializers.CharField(source='escenario.nombre', read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Evento
        fields = [
            'id', 'titulo', 'fecha', 'hora_inicio', 'hora_fin',
            'cupo_maximo', 'cupo_disponible', 'encargado',
            'tipo_nombre', 'escenario_nombre', 'is_full'
        ]
