from django.core.cache import cache
from django.conf import settings
from django.db.models import QuerySet

from .models import Product, Category
from django_redis import get_redis_connection


class CacheProducts:
    """Кеширование страницы продуктов"""

    @staticmethod
    def get_product_list(category_slug=None) -> QuerySet:
        """Список продуктов по категории с кешированием"""

        if not getattr(settings, "CACHE_ENABLED", False):
            qs = Product.objects.filter(is_active=True)

            if category_slug:
                qs = qs.filter(category__slug=category_slug)

            return qs.order_by("id")

        key = f"products_{category_slug or 'all'}"
        product_ids = cache.get(key)

        if product_ids is None:

            qs = Product.objects.filter(is_active=True)

            if category_slug:
                qs = qs.filter(category__slug=category_slug)

            product_ids = list(qs.values_list("id", flat=True))

            cache.set(key, product_ids, timeout=60 * 60)

        return Product.objects.filter(id__in=product_ids).order_by("id")

    @staticmethod
    def get_products_from_cache() -> QuerySet:
        """Список всех продуктов"""

        if not getattr(settings, "CACHE_ENABLED", False):
            return Product.objects.filter(is_active=True)

        key = "product_list"

        product_ids = cache.get(key)

        if product_ids is None:
            qs = Product.objects.filter(is_active=True)

            product_ids = list(qs.values_list("id", flat=True))

            cache.set(key, product_ids, timeout=60 * 60)

            return qs

        return Product.objects.filter(id__in=product_ids).order_by("id")

    @staticmethod
    def clear_product_cache() -> None:
        """Очистка кеша продуктов"""

        redis_conn = get_redis_connection("default")

        keys = redis_conn.keys("products_*")
        keys.append(b"product_list")

        if keys:
            redis_conn.delete(*keys)



class CacheCategories:
    """Кеширование страницы категорий"""
    @staticmethod
    def get_category_list() -> QuerySet:
        """Список всех активных категорий с кешированием"""
        if not getattr(settings, "CACHE_ENABLED", False):
            return Category.objects.filter(is_active=True)

        key = "category_list"
        category_id = cache.get(key)
        if category_id is not None:
            return Category.objects.filter(id__in=category_id).order_by("id")

        qs = Category.objects.filter(is_active=True)
        category_ids = list(qs.values_list("id", flat=True))
        cache.set(key, category_ids, timeout=60*60)
        return qs

