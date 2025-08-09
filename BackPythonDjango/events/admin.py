from django.contrib import admin
from .models import Tipo, Escenario, Equipamiento, Evento, EventoEscenario, EquipamientoPrestado


@admin.register(Tipo)
class TipoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion', 'created_at']
    search_fields = ['nombre', 'descripcion']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Escenario)
class EscenarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'ubicacion', 'capacidad', 'area', 'created_at']
    search_fields = ['nombre', 'ubicacion']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Equipamiento)
class EquipamientoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'created_at']
    search_fields = ['nombre']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


class EquipamientoPrestadoInline(admin.TabularInline):
    model = EquipamientoPrestado
    extra = 0


class EventoEscenarioInline(admin.TabularInline):
    model = EventoEscenario
    extra = 0


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = [
        'titulo', 'fecha', 'hora_inicio', 'hora_fin', 
        'cupo_maximo', 'cupo_disponible', 'tipo', 'escenario', 'encargado'
    ]
    search_fields = ['titulo', 'descripcion', 'encargado']
    list_filter = ['fecha', 'tipo', 'escenario', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'is_full', 'attendance_percentage']
    inlines = [EquipamientoPrestadoInline, EventoEscenarioInline]
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('titulo', 'descripcion', 'encargado', 'imagen')
        }),
        ('Ubicación y Fecha', {
            'fields': ('direccion', 'fecha', 'hora_inicio', 'hora_fin')
        }),
        ('Capacidad', {
            'fields': ('cupo_maximo', 'cupo_disponible')
        }),
        ('Relaciones', {
            'fields': ('tipo', 'escenario')
        }),
        ('Información Adicional', {
            'fields': ('is_full', 'attendance_percentage', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventoEscenario)
class EventoEscenarioAdmin(admin.ModelAdmin):
    list_display = ['evento', 'escenario', 'uso_capacidad', 'hora_inicio', 'hora_fin']
    search_fields = ['evento__titulo', 'escenario__nombre']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EquipamientoPrestado)
class EquipamientoPrestadoAdmin(admin.ModelAdmin):
    list_display = ['equipamiento', 'evento', 'cantidad', 'devuelto', 'created_at']
    search_fields = ['equipamiento__nombre', 'evento__titulo']
    list_filter = ['devuelto', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    actions = ['marcar_como_devuelto', 'marcar_como_prestado']
    
    def marcar_como_devuelto(self, request, queryset):
        queryset.update(devuelto=True)
        self.message_user(request, f'{queryset.count()} equipamientos marcados como devueltos.')
    marcar_como_devuelto.short_description = "Marcar como devuelto"
    
    def marcar_como_prestado(self, request, queryset):
        queryset.update(devuelto=False)
        self.message_user(request, f'{queryset.count()} equipamientos marcados como prestados.')
    marcar_como_prestado.short_description = "Marcar como prestado"


# Configuración del admin site
admin.site.site_header = "Job Management Admin"
admin.site.site_title = "Job Management"
admin.site.index_title = "Panel de Administración"
