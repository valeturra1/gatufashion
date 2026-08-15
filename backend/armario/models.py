from django.db import models
from django.conf import settings

# IMPORT CIRCULAR: cuando dos modelos se importan mutuamente y python no termina de cargar ninguno

def ropa_imagen(instance, filename):
    ext = filename.split('.')[-1]
    ropa = instance.ropa
    return f"ropa/{ropa.genero}/{ropa.categoria}/{ropa.slug}/{instance.tipo}.{ext}"

class Ropa(models.Model):
    TIPO_CATEGORIA = [
        ('camisa', 'Camisa'),
        ('pantalon', 'Pantalon'),
        ('zapatos', 'Zapatos'),
        ('cabello', 'Cabello'),
        ('cara', 'Cara'),
        ('accesorios', 'Accesorios'),
    ]

    TIPO_GENERO = [
        ('hombre', 'Hombre'),
        ('mujer', 'Mujer'),
        ('unisex', 'Unisex'),
    ]

    # columnas de la tabla
    slug = models.SlugField(unique=True) # para crear un identificador unico legible, ej camisa_verde en vez de un numero, no permtie espacios ni simbolos raros
    categoria = models.CharField(max_length=50, choices=TIPO_CATEGORIA)
    subcategoria = models.CharField(max_length=50, blank=True, null=True)  # cuello, gafas, gorros, pestañas
    genero = models.CharField(max_length=50, choices=TIPO_GENERO)

class ParteRopa(models.Model):
    TIPO_OPCIONES = [
        ('preview', 'Preview'),
        ('torso', 'Torso'),
        ('manga', 'Manga'),
        ('puesto', 'Puesto'),
    ]

    ropa = models.ForeignKey(Ropa, on_delete=models.CASCADE, related_name="partes_ropa")
    tipo = models.CharField(max_length=50, choices=TIPO_OPCIONES)
    imagen = models.ImageField(upload_to=ropa_imagen)

class RopasEquipadas(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ropas_equipadas") #usamos el settings.auth user model para evitar imports circulares
    ropa = models.ForeignKey(Ropa, on_delete=models.CASCADE) # apunta a una sola prenda
    equipado = models.BooleanField(default=False)

    class Meta: # dentro de esta clase se mete cosas que no describe columnas (como usuario, ropa, equipado) sino como se comportan el modelo en general
        constraints = [
            models.UniqueConstraint(fields=['usuario', 'ropa'], name='unico_usuario_ropa')  # aqui indica que no pueden existir dos filas con la misma combinacion de usuario y ropa
        ]

    # ponemos esto aca para que sea imposible de evitar esta logica
    def save(self, *args, **kwargs):
        if self.equipado == True: # si intentamos guardar una fila como equipada (si intentamos equipar una ropa)
            RopasEquipadas.objects.filter( # filtramos las filas donde se cumpla
                usuario=self.usuario, # el mismo usuario (el usuario que se le paso a esta funcion)
                ropa__categoria = self.ropa.categoria, # que la categoria sea la misma categoria de la prenda que estoy equipando
                ropa__subcategoria=self.ropa.subcategoria, # que la subcategoria sea la misma categoria de la prenda que estoy equipando
                equipado=True, # y que este equipado
            ).exclude(pk=self.pk).update(equipado=False) # excluimos la prenda actual del usuario que se le paso al metodo para no desequiparla a si misma
                                                        # y si se cumplen esas condiciones, desequipamos la prenda

        super().save(*args, **kwargs) # sobreescribimos el metodo save
    

class Outfits(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ropa = models.ManyToManyField(Ropa, related_name='outfits')
    nombre = models.CharField(max_length=50)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['usuario', 'nombre'], name='unico_nombre_outfit')
        ]
