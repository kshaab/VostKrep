from django.db import models


# Модель заявки (форма)
class Order(models.Model):
    name = models.CharField("Имя", max_length=255)
    phone = models.CharField("Телефон", max_length=50)
    email = models.EmailField("Email", blank=True)

    address = models.TextField("Адрес доставки", blank=True)
    comment = models.TextField("Комментарий", blank=True)

    file = models.FileField(upload_to="orders/files/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self) -> str:
        return f"Заявка {self.id}"


# Модель товаров в заявке
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_name = models.CharField("Товар", max_length=255)
    option_size = models.CharField("Размер", max_length=50)
    product_sku = models.CharField("Артикул", max_length=100, blank=True)  # артикул/id
    quantity = models.PositiveIntegerField("Количество")
    unit = models.CharField(max_length=150, verbose_name="Единица измерения", default="шт")

    class Meta:
        verbose_name = "Товар в заявке"
        verbose_name_plural = "Товары в заявке"
