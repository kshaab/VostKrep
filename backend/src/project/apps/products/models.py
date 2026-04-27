from django.db import models
from django.utils.text import slugify
from unidecode import unidecode


# Модель для категорий товаров
class Category(models.Model):
    name = models.CharField(max_length=150, verbose_name="Категория товара")
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="images/categories/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs) -> None:
        """Автоматическое создание slug по названию категории"""
        if not self.slug:
            self.slug = slugify(unidecode(str(self.name)))
        super().save(*args, **kwargs)


# Модель для товаров
class Product(models.Model):
    name = models.CharField(max_length=150, verbose_name="Название товара")
    slug = models.SlugField(unique=True, blank=True, max_length=150)
    sku = models.CharField(unique=True, max_length=150, verbose_name="Артикул")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    description = models.TextField(verbose_name="Описание товара", null=True, blank=True)
    unit = models.CharField(max_length=150, verbose_name="Единица измерения")
    image = models.ImageField(upload_to="images/products/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs) -> None:
        """Автоматическое создание slug по названию продукта"""
        if not self.slug:
            self.slug = slugify(unidecode(str(self.name)))
        super().save(*args, **kwargs)


# Модель для выбора размера товара
class ProductOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="options")
    size = models.CharField(max_length=150, verbose_name="Размер")
    sku = models.CharField(unique=True, max_length=150, verbose_name="Артикул")
    unit = models.CharField(max_length=150, verbose_name="Единица измерения", default="шт")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Размер товара"
        verbose_name_plural = "Размеры товара"

    def __str__(self) -> str:
        return f"{self.product.name} – {self.size}"


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="colors")
    color_name = models.CharField(max_length=50)

    class Meta:
        unique_together = ("product", "color_name")
        verbose_name = "Цвет товара"
        verbose_name_plural = "Цвета товара"

    def __str__(self):
        return f"{self.product.name} – {self.color_name}"
