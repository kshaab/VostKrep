from django.urls import path
from .views import OrderCreateAPIView


app_name = "order"

urlpatterns = [
    path("", OrderCreateAPIView.as_view(), name="order-create"),
]
