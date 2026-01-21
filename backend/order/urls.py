from django.urls import path
from .views import OrderCreateAPIView
from .apps import OrderConfig

app_name = OrderConfig.name

urlpatterns = [
    path("create/", OrderCreateAPIView.as_view(), name="order-create"),
]
