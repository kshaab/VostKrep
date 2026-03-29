from import_export import resources
from import_export.widgets import ForeignKeyWidget
from import_export import fields
from .models import Product, Category
from .models import ProductOption


class ProductResource(resources.ModelResource):
    """Импорт/экспорт товаров в БД через админку"""

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

    def before_import_row(self, row, **kwargs):
        """Создает категорию"""
        category_name = row.get("Категория")
        if category_name:
            Category.objects.get_or_create(name=category_name)

    def after_import_row(self, row, row_result, **kwargs):
        """Добавляет товары по артикулу и размеру"""
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

    def after_import(self, dataset, result, **kwargs):
        """Импортирует товары"""
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


class CategoryResource(resources.ModelResource):
    """Импорт/экспорт категорий в БД через админку"""

    name = fields.Field(column_name="Категория", attribute="name")

    class Meta:
        model = Category
        import_id_fields = ("name",)
        fields = ("name", "is_active")
        skip_unchanged = True
        report_skipped = True
