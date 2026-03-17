from rest_framework import viewsets

from project.apps.products.models import Category
from project.apps.products.pagination import ProductPagination, CategoryPagination
from project.apps.products.serializers import ProductSerializer, CategorySerializer
from project.apps.products.services import CacheProducts, CacheCategories


# Вьюсет для продуктов, только чтение, поиск по slug
class ProductViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = ProductSerializer
    lookup_field = "slug"
    pagination_class = ProductPagination

    def get_queryset(self):

        category_slug = self.request.query_params.get("category")

        if category_slug:
            return CacheProducts.get_product_list(category_slug)

        return CacheProducts.get_products_from_cache()


# Вьюсет для категорий, только чтение, поиск по slug
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = CategoryPagination

    def get_queryset(self):
        """Использует кеширование для списка категорий"""
        return CacheCategories.get_category_list()