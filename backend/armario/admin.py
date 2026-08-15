from django.contrib import admin
from .models import RopasEquipadas, Outfits, Ropa, ParteRopa

class ParteRopaInline(admin.TabularInline):
    model = ParteRopa
    extra = 0  # no muestres filas vacias extra para "agregar nueva" por defecto

class RopaAdmin(admin.ModelAdmin):
    list_display = ['slug', 'categoria', 'subcategoria', 'genero']  # columnas visibles en la lista
    list_filter = ['categoria', 'genero']  # filtros laterales, util con miles de prendas
    inlines = [ParteRopaInline]  # muestra las partes directo dentro de cada Ropa

admin.site.register(Ropa, RopaAdmin)
admin.site.register(RopasEquipadas)
admin.site.register(Outfits)