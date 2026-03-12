from rest_framework.routers import DefaultRouter
from .views import DeliveryPageViewSet, StaticPageViewSet

router = DefaultRouter()
router.register(r"delivery", DeliveryPageViewSet, basename="delivery-page")
router.register(r"pages", StaticPageViewSet, basename="static-page")

urlpatterns = router.urls