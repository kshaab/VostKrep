from django.conf import settings
from django.core.cache import cache

from .models import DeliveryPage, StaticPage


# Кеширование страницы доставки
class CacheDeliveryPage:
    @staticmethod
    def get_page():
        if not getattr(settings, "CACHE_ENABLED", False):
            return DeliveryPage.objects.first()

        key = "delivery_page"
        page = cache.get(key)
        if page is None:
            page = DeliveryPage.objects.first()
            cache.set(key, page, timeout=60 * 60)
        return page

    @staticmethod
    def clear_page_cache():
        """Очищает кеш страницы доставки"""
        cache.delete("delivery_page")


# Кеширование статичных страниц
class CacheStaticPage:
    @staticmethod
    def get_page(slug):
        if not getattr(settings, "CACHE_ENABLED", False):
            return StaticPage.objects.prefetch_related("sections__items").filter(slug=slug).first()

        key = f"page:{slug}"
        page = cache.get(key)

        if page is None:
            page = StaticPage.objects.prefetch_related("sections__items").filter(slug=slug).first()

            cache.set(key, page, timeout=60 * 60)

        return page

    @staticmethod
    def clear_page_cache(slug):
        cache.delete(f"page:{slug}")
