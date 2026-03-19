from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Category, Product
from .services import CacheProducts


@receiver([post_save, post_delete], sender=Product)
def clear_product_cache_signal(sender, instance, **kwargs) -> None:
    """Сбрасывает кеш после изменений в продуктах"""
    CacheProducts.clear_product_cache()


@receiver([post_save, post_delete], sender=Category)
def clear_category_cache(sender, instance, **kwargs) -> None:
    """Сбрасывает кеш после изменений в категориях"""
    cache.delete("category_list")
