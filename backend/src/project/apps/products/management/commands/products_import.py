from collections import defaultdict

import pandas as pd
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from project.apps.products.models import Category, Product, ProductOption
from unidecode import unidecode


def safe_str(value):
    return str(value).strip() if value else ""


class Command(BaseCommand):
    help = "Импорт товаров из Excel (с синхронизацией по SKU и размерам)"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]
        df = pd.read_excel(file_path)
        product_sizes_map = defaultdict(set)

        for _, row in df.iterrows():
            category_name = safe_str(row.get("Категория"))
            product_name = safe_str(row.get("Наименование"))
            sku = safe_str(row.get("Артикул"))
            size = safe_str(row.get("Размер"))[:150]

            # --------- Категория ---------
            category, _ = Category.objects.get_or_create(
                name=category_name, defaults={"slug": slugify(unidecode(category_name))[:150]}
            )

            # --------- Продукт по SKU ---------
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={
                    "name": product_name,
                    "category": category,
                    "description": safe_str(row.get("Описание")),
                    "unit": safe_str(row.get("Единица измерения")),
                    "slug": slugify(unidecode(product_name))[:150],
                },
            )

            # --------- Добавляем размеры как ProductOption ---------
            if size and size not in product_sizes_map[sku]:
                option_sku = f"{sku}-{size}"[:150]
                ProductOption.objects.update_or_create(product=product, size=size, defaults={"sku": option_sku})
                product_sizes_map[sku].add(size)

        self.stdout.write(self.style.SUCCESS("Импорт завершён"))
