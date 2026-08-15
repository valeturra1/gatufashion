from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .serializers import RopasEquipadasSerializer, GuardarOutfitSerializer, OutfitsSerializer, RopaSerializer
from .models import RopasEquipadas, Outfits, Ropa

# viewset es la clase que agrupa todas las operaciones de un modelo (listar, crear, editar, borrar) en un solo lugar,
# y django genera automáticamente las urls estándar para eso (get /api/ropa-equipada/, post /api/ropa-equipada/, etc)

# request.user: el usuario autenticado (gracias al JWT que validó DEFAULT_AUTHENTICATION_CLASSES)
# request.data: el body de la petición (por eso hiciste request.data.get('ropa_id'))
# request.method: 'POST', 'GET', etc.

class RopaViewSet(viewsets.ReadOnlyModelViewSet):  # solo get, nada de crear/editar/borrar desde la api
    queryset = Ropa.objects.all()
    serializer_class = RopaSerializer

class RopasEquipadasViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return RopasEquipadas.objects.filter(usuario=self.request.user) # filtramos para que solo modifique al usuario logueado que mando la peticion
    
    serializer_class = RopasEquipadasSerializer # con qué serializer los convierte

    # usamos @action cuando vamos a realizar una accion que no es listar, crear, editar o borrar, en este caso equipar
    # el detail=false indica que no depende de un objeto existente (si se esta equipando por primera vez, esa fila en la base de datos no existia)
    @action(detail=False, methods=['post'])
    def equipar(self, request, pk=None):
        ropa_id = request.data.get('ropa_id')  # el frontend manda {"ropa_id": 5}

        if not ropa_id: # si en el request no se envio el id de la ropa
            return Response({'error': 'Error, id de ropa no enviado'}, status=400)

        ropa = get_object_or_404(Ropa, pk=ropa_id)  # 404 si ese id de ropa no existe, si existe obtiene la prenda que coincida con ese id

        # devuelve la fila tal como se guardo la ultima vez, o la crea si esta no existe con equipado=True
        prendaEquipada, fue_creada = RopasEquipadas.objects.get_or_create(
            usuario=request.user, # para viewset usamos request que contiene todos los datos que envio la peticion, ya que self es una instancia de la misma vista
            ropa=ropa,
            defaults={'equipado': True}
        ) # esto devuelve una tupla, (prendaEquipada, fue_creada (que puede ser true or false))

        # si NO fue creada (ya existia la fila, probablemente con equipado=False),
        # get_or_create ignoro los defaults, asi que forzamos el equipado aca
        if not fue_creada:
            prendaEquipada.equipado = True
            prendaEquipada.save()

        return Response(self.get_serializer(prendaEquipada).data) # esto le envia al frontend la prenda equipada con su categoria e imagenes

class OutfitsViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Outfits.objects.filter(usuario=self.request.user) # filtramos para que solo modifique al usuario logueado que mando la peticion 

    # este viewset va a utilizar dos serializers distintos dependiendo de la accion:
    # si la accion de la peticion es post (o sea un create, el create que usamos dentro de guardaroutfitserializer) entonces devuelve ese serializer
    # de lo contrario devuelve el outfitsserializer
    def get_serializer_class(self):
        if self.action == 'create':
            return GuardarOutfitSerializer
        return OutfitsSerializer

    # reutilizamos la logica de prendasEquipadas
    @action(detail=True, methods=['post'])
    def equipar_outfit(self, request, pk=None):
        outfit = self.get_object() # busca el outfit que corresponde al id que enviaron {"ropa": 8}
        listaPrendasEquipadas = []

        for prenda in outfit.ropa.all(): # itera sobre la lista de prendas que conforman el outfit

            # devuelve la fila tal como se guardo la ultima vez, o la crea si esta no existe con equipado=True
            prendaEquipada, fue_creada = RopasEquipadas.objects.get_or_create(
                usuario=request.user, # para viewset usamos request que contiene todos los datos que envio la peticion, ya que self es una instancia de la misma vista
                ropa=prenda,
                defaults={'equipado': True}
            ) # esto devuelve una tupla, (prendaEquipada, fue_creada (que puede ser true or false))
    
            # si NO fue creada (ya existia la fila, probablemente con equipado=False),
            # get_or_create ignoro los defaults, asi que forzamos el equipado aca
            if not fue_creada:
                prendaEquipada.equipado = True
                prendaEquipada.save()

            listaPrendasEquipadas.append(prendaEquipada)
    
        return Response(RopasEquipadasSerializer(listaPrendasEquipadas, many=True).data) # esto le envia al frontend la lista de prendas equipada con su categoria e imagenes
