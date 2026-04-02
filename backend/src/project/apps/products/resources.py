from import_export import fields, resources
from import_export.widgets import ForeignKeyWidget
from django.utils.text import slugify

from .models import Category, Product, ProductOption


class ProductResource(resources.ModelResource):
    sku = fields.Field(column_name="Артикул", attribute="sku")
    name = fields.Field(column_name="Наименование", attribute="name")
    description = fields.Field(column_name="Описание", attribute="description")
    unit = fields.Field(column_name="Единица измерения", attribute="unit")

    category = fields.Field(
        column_name="Категория",
        attribute="category",
        widget=ForeignKeyWidget(Category, "name"),
    )

    class Meta:
        model = Product
        import_id_fields = ("sku",)
        skip_unchanged = True
        report_skipped = True

    # Получаем существующий продукт по SKU (не создаём дубли)
    def get_instance(self, instance_loader, row):
        sku = row.get("Артикул")
        if not sku:
            return None
        return Product.objects.filter(sku=sku).first()

    # Создаем категорию если её нет
    def before_import_row(self, row, **kwargs):
        for key in row:
            if isinstance(row[key], str):
                row[key] = row[key].strip()
        category_name = row.get("Категория")
        if category_name:
            Category.objects.get_or_create(name=category_name)

    # Генерация уникального slug (ОДИН раз на продукт)
    def before_save_instance(self, instance, row, **kwargs):
        if not instance.pk:
            base_slug = slugify(instance.name.strip())
            slug = base_slug
            i = 1

            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{i}"
                i += 1

            instance.slug = slug

    # Работа с размерами (вариантами)
    def after_import_row(self, row, row_result, **kwargs):
        sku = row.get("Артикул")
        size = row.get("Размер")

        if not sku or not size:
            return

        product = Product.objects.get(sku=sku)

        ProductOption.objects.update_or_create(
            product=product,
            size=size,
            defaults={
                "sku": f"{sku}-{size}",
                "unit": row.get("Единица измерения", product.unit),
                "is_active": True,
            },
        )

    # Отключаем отсутствующие размеры
    def after_import(self, dataset, result, **kwargs):
        existing = set()
        imported_skus = set()

        for row in dataset.dict:
            sku = row.get("Артикул")
            size = row.get("Размер")

            if sku:
                imported_skus.add(sku)

            if sku and size:
                existing.add((sku, size))

        products = Product.objects.filter(sku__in=imported_skus)

        for option in ProductOption.objects.filter(product__in=products).select_related("product"):
            key = (option.product.sku, option.size)

            if key not in existing:
                option.is_active = False
                option.save()
