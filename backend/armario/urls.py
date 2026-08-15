from rest_framework.routers import DefaultRouter
from .views import RopasEquipadasViewSet, OutfitsViewSet, RopaViewSet

# este router genera automaticamente las rutas post, get, put, etc, para cada viewset registrado
router = DefaultRouter()
router.register('ropas-equipadas', RopasEquipadasViewSet, basename='ropas-equipadas')
router.register('outfits', OutfitsViewSet, basename='outfits')
router.register('ropa', RopaViewSet, basename='ropa')

urlpatterns = router.urls