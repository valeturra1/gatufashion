from rest_framework.generics import CreateAPIView
from .serializers import RegistroSerializer


class RegistroView(CreateAPIView):
    serializer_class = RegistroSerializer