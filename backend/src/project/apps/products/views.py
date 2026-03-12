from rest_framework import viewsets
from rest_framework.request import Request

from .models import Category, Product
from .serializers import ProductSerializer, CategorySerializer
from .services import CacheProducts, CacheCategories


# Вьюсет для продуктов, только чтение, поиск по slug
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        """Использует кеширование для списка продуктов с возможностью фильтрации по категории"""
        request = self.request

        if hasattr(request, "query_params"):
            category_slug = request.query_params.get("category")
        else:
            category_slug = request.GET.get("category")
        if category_slug:
            return CacheProducts.get_product_list(category_slug)

        return CacheProducts.get_products_from_cache()


# Вьюсет для категорий, только чтение, поиск по slug
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        """Использует кеширование для списка категорий"""
        return CacheCategories.get_category_list()