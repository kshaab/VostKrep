from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet
from .apps import ProductsConfig

app_name = ProductsConfig.name

router = DefaultRouter()

router.register(r"product", ProductViewSet)
router.register(r"categories", CategoryViewSet)

urlpatterns = router.urls
