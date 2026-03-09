# from django.core.management.base import BaseCommand
# from django.utils.text import slugify
# from unidecode import unidecode
# import pandas as pd
#
# from .models import Category, Product, ProductOption
#
#
# class Command(BaseCommand):
#     help = "Импорт товаров из Excel"
#
#     def add_arguments(self, parser):
#         parser.add_argument("file_path", type=str)
#
#     def handle(self, *args, **kwargs):
#         file_path = kwargs["file_path"]
#         df = pd.read_excel(file_path)
#
#         for _, row in df.iterrows():
#
#             # Категория
#             category, _ = Category.objects.get_or_create(
#                 name=row["category"],
#                 defaults={"slug": slugify(unidecode(row["category"]))}
#             )
#
#             # Товар
#             # создаём товар
#             product, _ = Product.objects.update_or_create(
#                 sku=row["Артикул"],
#                 defaults={
#                     "name": row["Наименование"],
#                     "category": category,
#                     "description": row["Описание"],
#                     "unit": row["Единица измерения"],
#                 }
#             )
#
#             # создаём размер
#             if row.get("Размер"):
#                 ProductOption.objects.update_or_create(
#                     product=product,
#                     size=row["Размер"],
#                     defaults={
#                         "price": row["Цена (от)"],
#                         "sku": f"{row['Артикул']}-{row['Размер']}"
#                     }
#                 )
#
#         self.stdout.write(self.style.SUCCESS("Импорт завершён"))