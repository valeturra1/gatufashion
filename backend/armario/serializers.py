from rest_framework import serializers
from .models import Ropa, ParteRopa, RopasEquipadas, Outfits

# un serializer por cada modelo de armario

# ParteRopaSerializer, RopaSerializer, RopasEquipadasSerializer, OutfitsSerializer
# son de lectura, es decir, convierten lo que ya esta en la base de datos a json para que el frontend lo muestre

# anidamos un serializer en una sola direccion, que es la direccion en la que realmente vamos a pedir los datos
# ej: dame la prenda con sus partes

class ParteRopaSerializer(serializers.ModelSerializer):
    class Meta: # para usar meta necesitamos el modelserializer, sino lo usamos usamos serializer normal
        model = ParteRopa # le dice de que modelo saca los campos
        fields = ['tipo', 'imagen'] # las columnas o datos que va a mostrar en el json

class RopaSerializer(serializers.ModelSerializer):
    partes_ropa = ParteRopaSerializer(many=True, read_only=True) # many=true indica que va a serializar una lista de objetos, es decir, una ropa tiene varias partes ropa (manga, etc)

    class Meta:
        model = Ropa
        fields = ['id', 'slug', 'categoria', 'subcategoria', 'partes_ropa']

class RopasEquipadasSerializer(serializers.ModelSerializer):
    # Cuando no declaramos un campo a mano, ModelSerializer lo genera automáticamente mirando el tipo de campo en el modelo
    # pero por defecto, para un ForeignKey, solo devuelve el id del objeto mas no el objeto completo,
    # pero aca necesitamos el objeto completo (imagen, categoria, etc)

    ropa = RopaSerializer(read_only=True) # esto es un serializer anidado, no ponemos many=true porque cada fila de esto apunta exactamente a solo una prenda

    class Meta:
        model = RopasEquipadas
        fields = ['usuario' , 'ropa', 'equipado']

class OutfitsSerializer(serializers.ModelSerializer):
    ropa = RopaSerializer(many=True, read_only=True)

    class Meta:
        model = Outfits
        fields = ['usuario', 'ropa', 'nombre']

class GuardarOutfitSerializer(serializers.ModelSerializer):
    # esto lo que hace es que recibe ids, este ropa_ids los tranforma en instancias reales de ropa con categoria, subcategoria, etc
    ropa_ids = serializers.PrimaryKeyRelatedField(
        queryset=Ropa.objects.all(),   # valida que cada id exista como ropa real, el queryset dice que solo consulte la base de datos cuando se lo pidan
        many=True,                     # acepta una lista de ids, no uno solo
        write_only=True,               # solo para recibir, no aparece al mostrar el outfit (no queremos devolver los ids sino ropa real con imagenes)
        source='ropa'                  # se guarda en el atributo ropa del modelo outfits
    )

    class Meta:
        model = Outfits
        fields = ['nombre', 'ropa_ids']

    # validamos que no se intente guardar un outfit con prendas repetidas
    def validate(self, data):
        ropa = data['ropa']

        vistos = set() # set representa una coleccion de elementos unicos, sin orden, en el que no se ingresan duplicados. Esto se pudo haber hecho tambien con listas

        for prenda in ropa: # recorremos los objetos ropa, prenda es una instancia de ropa
            clave = (prenda.categoria, prenda.subcategoria) # armamos una tupla con los dos datos que definen la prenda, por ejemplo ('accesorios', 'gorros') o ('camisa', None) si no tiene subcategoria

            if clave in vistos: # si esa misma combinacion ya fue vista antes
                raise serializers.ValidationError(f"Ya hay una prenda de {prenda.categoria}/{prenda.subcategoria} en este outfit") # lanzamos un error
            vistos.add(clave) # sino, la añadimos a vistos para que si se repite pueda ser detectada mas adelante

        return data

    def create(self, validated_data):
        ropa = validated_data.pop('ropa')          # sacamos la lista de prendas (el valor asociado a la clave ropa)
        usuario = self.context['request'].user     # sacamos al usuario autenticado desde el request que llega a través de self.context, 
                                                   # un diccionario que la vista le pasa al serializer cuando lo instancia

        outfit = Outfits.objects.create(           # creamos la fila de la tabla outfit con los datos normales (los que no son muchos a muchos)
            usuario=usuario,
            nombre=validated_data['nombre'],
        )

        outfit.ropa.set(ropa) # al ya tener el outfit creado con un id que se le asigna automatico, podemos setear el campo ropa del outfit, el que es muchos a muchos

        return outfit # devuelve la instancia que acababos de crear


