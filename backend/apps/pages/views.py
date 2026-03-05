from rest_framework.generics import RetrieveAPIView
from .models import DeliveryPage
from .serializers import DeliveryPageSerializer

class DeliveryPageView(RetrieveAPIView):
    queryset = DeliveryPage.objects.all()
    serializer_class = DeliveryPageSerializer
    lookup_field = "slug"
