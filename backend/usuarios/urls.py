from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CambiarPasswordView, RecuperarPasswordView, RegistroView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login-refresh'),
    path('recuperar-password/', RecuperarPasswordView.as_view(), name='recuperar-password'),
    path('cambiar-password/', CambiarPasswordView.as_view(), name='cambiar-password'),
]