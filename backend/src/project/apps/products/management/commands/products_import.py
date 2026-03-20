from collections import defaultdict

import pandas as pd
from django.core.management.base import BaseCommand
from django.db.models.signals import post_delete, post_save
from django.utils.text import slugify
from project.apps.products.models import Category, Product, ProductOption
from project.apps.products.signals import clear_category_cache, clear_product_cache_signal
from unidecode import unidecode


def safe_str(value):
    if value is None:
        return ""
    return str(value).strip()


class Command(BaseCommand):
    help = "Импорт товаров из Excel (с синхронизацией)"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]

        # отключаем сигналы
        post_save.disconnect(clear_product_cache_signal, sender=Product)
        post_delete.disconnect(clear_product_cache_signal, sender=Product)
        post_save.disconnect(clear_category_cache, sender=Category)
        post_delete.disconnect(clear_category_cache, sender=Category)

        df = pd.read_excel(file_path)

        product_sizes_map = defaultdict(set)

        for _, row in df.iterrows():
            category_name = safe_str(row.get("Категория"))
            product_name = safe_str(row.get("Наименование"))
            sku = safe_str(row.get("Артикул"))
            size = safe_str(row.get("Размер"))[:150]

            category, _ = Category.objects.get_or_create(
                name=category_name,
                defaults={"slug": slugify(unidecode(category_name))[:150]},
            )

            # -------- создаём/получаем Product по SKU --------
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={
                    "name": product_name,
                    "category": category,
                    "description": safe_str(row.get("Описание")),
                    "unit": safe_str(row.get("Единица измерения")),
                    "slug": f"{slugify(unidecode(product_name))[:140]}-{sku}"[:150],
                },
            )

            # -------- OPTIONS --------
            if size:
                sku_option = f"{sku}-{size}"[:150]
                ProductOption.objects.update_or_create(
                    product=product,
                    size=size,
                    defaults={"sku": sku_option},
                )
                product_sizes_map[sku].add(size)

        # -------- УДАЛЕНИЕ ЛИШНИХ РАЗМЕРОВ --------
        for sku, sizes in product_sizes_map.items():
            try:
                product = Product.objects.get(sku=sku)
            except Product.DoesNotExist:
                continue
            ProductOption.objects.filter(product=product).exclude(size__in=sizes).delete()

        self.stdout.write(self.style.SUCCESS("Импорт завершён"))
