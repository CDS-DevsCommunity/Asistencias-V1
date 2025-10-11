from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class Tipo(models.Model):
    """Modelo para tipos de eventos"""
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Tipo de Evento"
        verbose_name_plural = "Tipos de Eventos"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Escenario(models.Model):
    """Modelo para escenarios donde se realizan eventos"""
    nombre = models.CharField(max_length=200)
    ubicacion = models.CharField(max_length=300)
    descripcion = models.TextField(blank=True, null=True)
    capacidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    area = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text="Área en metros cuadrados"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Escenario"
        verbose_name_plural = "Escenarios"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.ubicacion}"


class Equipamiento(models.Model):
    """Modelo para equipamientos disponibles"""
    nombre = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Equipamiento"
        verbose_name_plural = "Equipamientos"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Evento(models.Model):
    """Modelo principal para eventos"""
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    direccion = models.CharField(max_length=300)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    cupo_maximo = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    cupo_disponible = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )
    encargado = models.CharField(max_length=200, help_text="Persona responsable del evento")
    imagen = models.ImageField(
        upload_to='eventos/', 
        blank=True, 
        null=True,
        help_text="Imagen del evento"
    )
    
    # Relaciones
    tipo = models.ForeignKey(
        Tipo, 
        on_delete=models.CASCADE,
        related_name='eventos'
    )
    escenario = models.ForeignKey(
        Escenario, 
        on_delete=models.CASCADE,
        related_name='eventos'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['-fecha', '-hora_inicio']

    def __str__(self):
        return f"{self.titulo} - {self.fecha}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.hora_fin <= self.hora_inicio:
            raise ValidationError('La hora de fin debe ser posterior a la hora de inicio')
        if self.cupo_disponible > self.cupo_maximo:
            raise ValidationError('El cupo disponible no puede ser mayor al cupo máximo')

    @property
    def is_full(self):
        """Verifica si el evento está lleno"""
        return self.cupo_disponible == 0

    @property
    def attendance_percentage(self):
        """Calcula el porcentaje de asistencia"""
        if self.cupo_maximo == 0:
            return 0
        occupied = self.cupo_maximo - self.cupo_disponible
        return round((occupied / self.cupo_maximo) * 100, 2)


class EventoEscenario(models.Model):
    """Tabla intermedia para la relación many-to-many entre Evento y Escenario con campos adicionales"""
    uso_capacidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Capacidad utilizada del escenario para este evento"
    )
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    
    # Relaciones
    evento = models.ForeignKey(
        Evento, 
        on_delete=models.CASCADE,
        related_name='evento_escenarios'
    )
    escenario = models.ForeignKey(
        Escenario, 
        on_delete=models.CASCADE,
        related_name='evento_escenarios'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento Escenario"
        verbose_name_plural = "Eventos Escenarios"
        unique_together = ['evento', 'escenario']

    def __str__(self):
        return f"{self.evento.titulo} en {self.escenario.nombre}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.hora_fin <= self.hora_inicio:
            raise ValidationError('La hora de fin debe ser posterior a la hora de inicio')
        if self.escenario and self.uso_capacidad > self.escenario.capacidad:
            raise ValidationError('El uso de capacidad no puede exceder la capacidad del escenario')


class EquipamientoPrestado(models.Model):
    """Modelo para equipamientos prestados en eventos"""
    cantidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    devuelto = models.BooleanField(default=False)
    descripcion = models.TextField(
        blank=True, 
        null=True,
        help_text="Descripción adicional o notas sobre el préstamo"
    )
    
    # Relaciones
    equipamiento = models.ForeignKey(
        Equipamiento, 
        on_delete=models.CASCADE,
        related_name='prestamos'
    )
    evento = models.ForeignKey(
        Evento, 
        on_delete=models.CASCADE,
        related_name='equipamientos_prestados'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Equipamiento Prestado"
        verbose_name_plural = "Equipamientos Prestados"
        unique_together = ['equipamiento', 'evento']

    def __str__(self):
        estado = "Devuelto" if self.devuelto else "Prestado"
        return f"{self.equipamiento.nombre} - {self.evento.titulo} ({estado})"


class Inscripcion(models.Model):
    """Registro de inscripciones de personas/usuarios a eventos"""
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('asistio', 'Asistió'),
        ('no_asistio', 'No asistió'),
    ]

    # Relación con Persona (puede ser usuario registrado o asistente sin cuenta)
    persona = models.ForeignKey('authentication.Persona', on_delete=models.CASCADE, related_name='inscripciones')
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='inscripciones')
    fecha_inscripcion = models.DateField(auto_now_add=True)
    hora_inscripcion = models.TimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['persona', 'evento']
        verbose_name = 'Inscripción'
        verbose_name_plural = 'Inscripciones'

    def __str__(self):
        # Mostrar nombre si está disponible, sino una referencia por id
        persona_str = str(self.persona) if self.persona else f"Persona {self.persona_id}"
        return f"{persona_str} -> {self.evento.titulo} ({self.estado})"


class Equipo(models.Model):
    """Modelo para equipos de voluntarios"""
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    cantidad = models.PositiveIntegerField(default=0)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='equipos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'

    def __str__(self):
        return f"{self.nombre} ({self.evento.titulo})"


class Voluntario(models.Model):
    """Tabla intermedia para usuarios que pertenecen a equipos"""
    from django.contrib.auth.models import User
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='voluntariados')
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='voluntarios')
    fecha_union = models.DateField(auto_now_add=True)
    rol_en_equipo = models.CharField(max_length=150, blank=True)

    class Meta:
        unique_together = ['usuario', 'equipo']
        verbose_name = 'Voluntario'
        verbose_name_plural = 'Voluntarios'

    def __str__(self):
        return f"{self.usuario.username} en {self.equipo.nombre}"
