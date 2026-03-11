from rest_framework.routers import DefaultRouter
from .views import DeliveryPageViewSet

router = DefaultRouter()
router.register(r"delivery", DeliveryPageViewSet, basename="delivery-page")

urlpatterns = router.urls