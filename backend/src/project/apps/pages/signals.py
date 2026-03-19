from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import DeliveryItem, DeliveryPage, StaticPage, StaticPageItem, StaticPageSection
from .services import CacheDeliveryPage, CacheStaticPage


@receiver([post_save, post_delete], sender=DeliveryPage)
def clear_delivery_page_cache(sender, instance, **kwargs) -> None:
    CacheDeliveryPage.clear_page_cache()


@receiver([post_save, post_delete], sender=DeliveryItem)
def clear_delivery_items_cache(sender, instance, **kwargs) -> None:
    CacheDeliveryPage.clear_page_cache()


@receiver([post_save, post_delete], sender=StaticPage)
def clear_static_page_cache(sender, instance, **kwargs) -> None:
    CacheStaticPage.clear_page_cache(instance.slug)


@receiver([post_save, post_delete], sender=StaticPageSection)
def clear_static_section_cache(sender, instance, **kwargs) -> None:
    CacheStaticPage.clear_page_cache(instance.page.slug)


@receiver([post_save, post_delete], sender=StaticPageItem)
def clear_static_item_cache(sender, instance, **kwargs) -> None:
    CacheStaticPage.clear_page_cache(instance.section.page.slug)
