from django.db import models

# Модель страницы доставки
class DeliveryPage(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField() # Описание доставки
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)

    def __str__(self):
        return self.title

# Модель контента страницы доставки
class DeliveryItem(models.Model):
    page = models.ForeignKey(
        DeliveryPage,
        on_delete=models.CASCADE,
        related_name="items"
    )

    text = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.text
