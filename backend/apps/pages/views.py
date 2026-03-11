from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from .serializers import DeliveryPageSerializer
from .services import CacheDeliveryPage


class DeliveryPageViewSet(ViewSet):

    def list(self, request):
        """Просмотр страницы доставки"""
        page = CacheDeliveryPage.get_page()
        serializer = DeliveryPageSerializer(page)
        return Response(serializer.data)
