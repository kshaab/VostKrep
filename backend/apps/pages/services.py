from django.core.cache import cache
from django.conf import settings
from .models import DeliveryPage
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

#Кеширование страницы доставки
class CacheDeliveryPage:
    @staticmethod
    def get_page():
        if not getattr(settings, "CACHE_ENABLED", False):
            return DeliveryPage.objects.first()

        key = "delivery_page"
        page = cache.get(key)
        if page is None:
            page = DeliveryPage.objects.first()
            cache.set(key, page, timeout=60*60)
        return page

    @staticmethod
    def clear_page_cache():
        """Очищает кеш страницы доставки"""
        cache.delete("delivery_page")


@receiver([post_save, post_delete], sender=DeliveryPage)
def clear_delivery_page_cache():
    """Сбрасывает кеш при изменении страницы доставки"""
    CacheDeliveryPage.clear_page_cache()