from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Persona, Cargo, Permiso, Rol, RolPermiso


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    # Campos opcionales para crear/actualizar Persona
    nombre = serializers.CharField(write_only=True, required=False, allow_blank=True)
    apellido = serializers.CharField(write_only=True, required=False, allow_blank=True)
    ci = serializers.CharField(write_only=True, required=False, allow_blank=True)
    direccion = serializers.CharField(write_only=True, required=False, allow_blank=True)
    telefono = serializers.CharField(write_only=True, required=False, allow_blank=True)
    cargo_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 
                 'nombre', 'apellido', 'ci', 'direccion', 'telefono', 'cargo_id']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data

    def create(self, validated_data):
        # Extraemos campos de persona
        validated_data.pop('password_confirm')
        nombre = validated_data.pop('nombre', '')
        apellido = validated_data.pop('apellido', '')
        ci = validated_data.pop('ci', '')
        direccion = validated_data.pop('direccion', '')
        telefono = validated_data.pop('telefono', '')
        cargo_id = validated_data.pop('cargo_id', None)

        user = User.objects.create_user(**validated_data)

        # Actualizamos o creamos la persona asociada
        persona, _ = Persona.objects.get_or_create(user=user)
        persona.nombre = nombre or persona.nombre
        persona.apellido = apellido or persona.apellido
        persona.ci = ci or persona.ci
        persona.direccion = direccion or persona.direccion
        persona.telefono = telefono or persona.telefono
        if cargo_id:
            try:
                persona.cargo_id = int(cargo_id)
            except Exception:
                pass
        persona.email = user.email or persona.email
        persona.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales inválidas')
            if not user.is_active:
                raise serializers.ValidationError('Usuario inactivo')
            data['user'] = user
        else:
            raise serializers.ValidationError('Username y password son requeridos')
        
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()


class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['id', 'nombre', 'descripcion', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PersonaSerializer(serializers.ModelSerializer):
    cargo_nombre = serializers.CharField(source='cargo.nombre', read_only=True)

    class Meta:
        model = Persona
        fields = [
            'id', 'user', 'nombre', 'apellido', 'ci', 'direccion', 'telefono', 'email',
            'cargo', 'cargo_nombre', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = ['id', 'nombre', 'descripcion', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RolPermisoSerializer(serializers.ModelSerializer):
    permiso_nombre = serializers.CharField(source='permiso.nombre', read_only=True)
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)

    class Meta:
        model = RolPermiso
        fields = ['id', 'rol', 'rol_nombre', 'permiso', 'permiso_nombre', 'created_at']
        read_only_fields = ['id', 'created_at']


class RolSerializer(serializers.ModelSerializer):
    permisos = PermisoSerializer(many=True, read_only=True)

    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion', 'permisos', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
