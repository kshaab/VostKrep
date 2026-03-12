from django.core.management.base import BaseCommand
from django.utils.text import slugify
from unidecode import unidecode
import pandas as pd
from django.db.models.signals import post_save, post_delete
from apps.products.models import Category, Product, ProductOption
from apps.products.signals import clear_product_cache_signal,clear_category_cache



post_save.disconnect(clear_product_cache_signal, sender=Product)
post_delete.disconnect(clear_product_cache_signal, sender=Product)

post_save.disconnect(clear_category_cache, sender=Category)
post_delete.disconnect(clear_category_cache, sender=Category)

def safe_str(value):
    """Приводит любое значение к строке"""
    if value is None:
        return ""
    return str(value).strip()


class Command(BaseCommand):
    help = "Импорт товаров из Excel"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]

        # отключаем сигналы на время импорта
        post_save.disconnect(clear_product_cache_signal, sender=Product)
        post_delete.disconnect(clear_product_cache_signal, sender=Product)
        post_save.disconnect(clear_category_cache, sender=Category)
        post_delete.disconnect(clear_category_cache, sender=Category)

        df = pd.read_excel(file_path)

        for _, row in df.iterrows():
            # --- Категория ---
            category_name = safe_str(row.get("Категория"))
            base_slug_cat = slugify(unidecode(category_name))[:150]
            slug_cat = base_slug_cat
            counter = 1
            while Category.objects.filter(slug=slug_cat).exists():
                suffix = f"-{counter}"
                slug_cat = f"{base_slug_cat[:150-len(suffix)]}{suffix}"
                counter += 1

            category, _ = Category.objects.get_or_create(
                name=category_name,
                defaults={"slug": slug_cat}
            )

            # --- Продукт ---
            product_name = safe_str(row.get("Наименование"))
            base_slug_prod = slugify(unidecode(product_name))[:150]
            slug_prod = base_slug_prod
            counter = 1
            while Product.objects.filter(slug=slug_prod).exists():
                suffix = f"-{counter}"
                slug_prod = f"{base_slug_prod[:150-len(suffix)]}{suffix}"
                counter += 1

            product, _ = Product.objects.update_or_create(
                sku=safe_str(row.get("Артикул")),
                defaults={
                    "name": product_name,
                    "slug": slug_prod,
                    "category": category,
                    "description": safe_str(row.get("Описание")),
                    "unit": safe_str(row.get("Единица измерения")),
                }
            )

            # --- Опция продукта ---
            size = safe_str(row.get("Размер"))[:150]
            sku_option = f"{safe_str(row.get('Артикул'))}-{size}"[:150]

            ProductOption.objects.update_or_create(
                product=product,
                size=size,
                defaults={"sku": sku_option}
            )

        self.stdout.write(self.style.SUCCESS("Импорт завершён"))