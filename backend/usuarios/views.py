from rest_framework.generics import CreateAPIView, GenericAPIView
from .serializers import RegistroSerializer, RecuperarPasswordSerializer
from rest_framework.response import Response

class RegistroView(CreateAPIView):
    serializer_class = RegistroSerializer

class RecuperarPasswordView(GenericAPIView):
    serializer_class = RecuperarPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Correo de recuperación enviado"})