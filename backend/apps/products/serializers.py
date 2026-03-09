from rest_framework import serializers
from .models import Category, Product, ProductOption

# Сериализатор продуктов
class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ["name", "sku", "category", "description", "price", "unit", "image", "is_active", "created_at"]

    def get_image(self, obj):
        """Превращает путь картики из базы в URL для загрузки фронтендом"""
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

# Сериализатор выбора опций товара
class ProductOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOption
        fields = ["id", "size", "price", "sku"]

# Сериализатор категорий
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name", "parent", "image", "is_active"]

    def get_image(self, obj):
        """Превращает путь картики из базы в URL для загрузки фронтендом"""
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None