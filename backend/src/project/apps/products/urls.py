from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet
from .apps import ProductsConfig

app_name = "products"

router = DefaultRouter()

router.register(r"products", ProductViewSet, basename="products")
router.register(r"categories", CategoryViewSet)

urlpatterns = router.urls
