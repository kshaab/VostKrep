from django.urls import path
from .views import DeliveryPageView

urlpatterns = [
    path("delivery/<slug:slug>/", DeliveryPageView.as_view()),
]