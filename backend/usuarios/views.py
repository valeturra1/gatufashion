from rest_framework.generics import CreateAPIView, GenericAPIView
from .serializers import CambiarPasswordSerializer, RegistroSerializer, RecuperarPasswordSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class RegistroView(CreateAPIView):
    permission_classes = [AllowAny] # esto es para permitir que el usuario pueda acceder a esto sin estar logueado / autenticado, ya que por defecto tenemos en nuestra configuracion que debe estar autenticado
    serializer_class = RegistroSerializer

class RecuperarPasswordView(GenericAPIView):
    permission_classes = [AllowAny] 
    serializer_class = RecuperarPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Correo de recuperación enviado"})

class CambiarPasswordView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = CambiarPasswordSerializer # aqui definimos el serializer que vamos a usar para cambiar la contraseña, siempre se debe hacer esto

    def post(self, request):
        serializer = self.get_serializer(data=request.data) # aca obtenemos los datos que nos envia el usuario creando una instancia de esa clase,
        # en este caso la contraseña, el token y el uid (id usuario)

        serializer.is_valid(raise_exception=True) # aca validamos los datos que nos envia el usuario con nuestro metodo validate, si no son validos mandamos un error
        serializer.save() # aca guardamos la nueva contraseña del usuario ejecutando el metodo save que definimos en el serializer
        return Response({"mensaje": "Contraseña cambiada exitosamente"})