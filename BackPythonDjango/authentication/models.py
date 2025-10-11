from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Cargo(models.Model):
	"""Cargo o puesto que puede tener una persona/usuario"""
	nombre = models.CharField(max_length=100, unique=True)
	descripcion = models.TextField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Cargo"
		verbose_name_plural = "Cargos"
		ordering = ['nombre']

	def __str__(self):
		return self.nombre


class Persona(models.Model):
	"""Perfil extendido de usuario. OneToOne con el modelo User de Django."""
	# user puede ser null para representar personas que no tienen cuenta en el sistema
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='persona', null=True, blank=True)
	nombre = models.CharField(max_length=150, blank=True)
	apellido = models.CharField(max_length=150, blank=True)
	ci = models.CharField(max_length=50, blank=True, null=True)
	direccion = models.CharField(max_length=250, blank=True)
	telefono = models.CharField(max_length=50, blank=True)
	email = models.EmailField(blank=True)
	cargo = models.ForeignKey(Cargo, on_delete=models.SET_NULL, null=True, blank=True, related_name='personas')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Persona"
		verbose_name_plural = "Personas"
		ordering = ['user__username']

	def __str__(self):
		if self.nombre or self.apellido:
			return f"{self.nombre} {self.apellido}".strip()
		return self.user.username


@receiver(post_save, sender=User)
def create_or_update_persona(sender, instance, created, **kwargs):
	"""Crea automáticamente una Persona asociada cuando se crea un User.
	Si ya existe, se asegura de que exista la relación.
	"""
	if created:
		Persona.objects.create(
			user=instance,
			nombre=instance.first_name or '',
			apellido=instance.last_name or '',
			email=instance.email or ''
		)
	else:
		# Garantizar que exista la Persona (por si fue borrada accidentalmente)
		Persona.objects.get_or_create(user=instance)



class Permiso(models.Model):
	"""Permisos personalizados (si se requiere metadata adicional sobre permisos)"""
	nombre = models.CharField(max_length=150, unique=True)
	descripcion = models.TextField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = 'Permiso'
		verbose_name_plural = 'Permisos'
		ordering = ['nombre']

	def __str__(self):
		return self.nombre


class Rol(models.Model):
	"""Rol o grupo de permisos"""
	nombre = models.CharField(max_length=150, unique=True)
	descripcion = models.TextField(blank=True, null=True)
	permisos = models.ManyToManyField(Permiso, through='RolPermiso', related_name='roles', blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = 'Rol'
		verbose_name_plural = 'Roles'
		ordering = ['nombre']

	def __str__(self):
		return self.nombre


class RolPermiso(models.Model):
	"""Tabla intermedia entre Rol y Permiso para permitir metadatos en la relación"""
	rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='rol_permisos')
	permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE, related_name='permiso_roles')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ['rol', 'permiso']
		verbose_name = 'Rol Permiso'
		verbose_name_plural = 'Roles Permisos'

	def __str__(self):
		return f"{self.rol.nombre} - {self.permiso.nombre}"
