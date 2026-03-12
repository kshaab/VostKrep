from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from .serializers import DeliveryPageSerializer, StaticPageSerializer
from .services import CacheDeliveryPage, CacheStaticPage
from .models import StaticPage


class DeliveryPageViewSet(ViewSet):

    def list(self, request):
        """Просмотр страницы доставки"""
        page = CacheDeliveryPage.get_page()
        serializer = DeliveryPageSerializer(page)
        return Response(serializer.data)



class StaticPageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StaticPageSerializer
    lookup_field = "slug"

    def get_object(self):
        slug = self.kwargs.get("slug")
        return CacheStaticPage.get_page(slug)

    def get_queryset(self):
        return StaticPage.objects.none()
