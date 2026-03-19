from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .models import StaticPage
from .serializers import DeliveryPageSerializer, StaticPageSerializer
from .services import CacheDeliveryPage, CacheStaticPage


class DeliveryPageViewSet(ViewSet):

    def list(self, request) -> Response:
        """Просмотр страницы доставки"""
        page = CacheDeliveryPage.get_page()
        serializer = DeliveryPageSerializer(page)
        return Response(serializer.data)


class StaticPageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StaticPageSerializer
    lookup_field = "slug"

    def get_object(self) -> StaticPage:
        slug = self.kwargs.get("slug")
        return CacheStaticPage.get_page(slug)

    def get_queryset(self) -> QuerySet:
        return StaticPage.objects.none()
