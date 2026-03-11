from django.core.cache import cache
from django.conf import settings
from .models import Product, Category
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_redis import get_redis_connection

#Кеширование страницы продуктов
class CacheProducts:
    @staticmethod
    def get_product_list(category_name=None):
        """Список продуктов по категориям с низкоуровневым кешированием"""
        if not getattr(settings, "CACHE_ENABLED", False):
            return Product.objects.all().order_by("id")

        key = f"products_{category_name or 'all'}"
        product_ids = cache.get(key)
        if product_ids is None:
            qs = Product.objects.filter(is_active=True)
            if category_name:
                qs = qs.filter(category__name=category_name)
            product_ids = list(qs.values_list("id", flat=True))
            cache.set(key, product_ids, timeout=60*60)
        return Product.objects.filter(id__in=product_ids).order_by("id")

    @staticmethod
    def get_products_from_cache():
        """Список всех активных продуктов с кешированием"""
        if not getattr(settings, "CACHE_ENABLED", False):
            return Product.objects.filter(is_active=True)

        key = "product_list"
        product_id = cache.get(key)
        if product_id is not None:
            return Product.objects.filter(id__in=product_id).order_by("id")

        qs = Product.objects.filter(is_active=True)
        product_ids = list(qs.values_list("id", flat=True))
        cache.set(key, product_ids, timeout=60*60)
        return qs

    @staticmethod
    def clear_product_cache():
        """Очищает кеш страницы продуктов"""
        redis_conn = get_redis_connection("default")
        keys = redis_conn.keys("products_*")
        keys.append(b"product_list")
        if keys:
            redis_conn.delete(*keys)

@receiver([post_save, post_delete], sender=Product)
def clear_product_cache_signal():
    """Сбрасывает кеш после изменений в продуктах"""
    CacheProducts.clear_product_cache()



#Кеширование страницы категорий
class CacheCategories:
    @staticmethod
    def get_category_list():
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

@receiver([post_save, post_delete], sender=Category)
def clear_category_cache():
    """Сбрасывает кеш после изменений в категориях"""
    cache.delete("category_list")