from django.db import models
from django.utils.text import slugify
from unidecode import unidecode


# Модель для категорий товаров
class Category(models.Model):
    name = models.CharField(max_length=150, verbose_name="Категория товара")
    # Ссылка на подкатегории (болты - болты дин, болты гост и т.д)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    # Название категории в пути
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="images/categories/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Автоматическое создание slug по названию категории"""
        if not self.slug:
            self.slug = slugify(unidecode(self.name))
        super().save(*args, **kwargs)

# Модель для товаров
class Product(models.Model):
    name = models.CharField(max_length=150, verbose_name="Название товара")
    slug = models.SlugField(unique=True, blank=True)
    sku = models.CharField(unique=True, max_length=150, verbose_name="Артикул")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    description = models.TextField(verbose_name="Описание товара")
    price = models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Цена")
    unit = models.CharField(max_length=150, verbose_name="Единица измерения")
    image = models.ImageField(upload_to="images/product/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Автоматическое создание slug по названию продукта"""
        if not self.slug:
            self.slug = slugify(unidecode(self.name))
        super().save(*args, **kwargs)

