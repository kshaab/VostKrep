from django.db import models

# Модель страницы доставки
class DeliveryPage(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    # Описание доставки
    content = models.TextField()
    seo_title = models.CharField(max_length=255, blank=True) # ?
    seo_description = models.TextField(blank=True) # ?

    def __str__(self):
        return self.title

