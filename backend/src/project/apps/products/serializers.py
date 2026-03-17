from rest_framework import serializers
from .models import Category, Product, ProductOption
from .validators import ProductValidator


# Сериализатор выбора опций товара
class ProductOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOption
        fields = ["id", "size", "sku"]

    def validate(self, data):
        """Валидирует sku"""
        ProductValidator.validate_name(data.get("size"), "size")
        ProductValidator.validate_sku(data.get("sku"))
        return data


# Сериализатор продуктов
class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    options = ProductOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["name", "sku", "category", "description", "unit", "image", "is_active", "created_at", "slug", "options"]

    def get_image(self, obj) -> None:
        """Превращает путь картики из базы в URL для загрузки фронтендом"""
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def validate(self, data):
        """Валидирует sku"""
        ProductValidator.validate_name(data.get("size"), "size")
        ProductValidator.validate_sku(data.get("sku"))
        return data


# Сериализатор категорий
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name", "parent", "image", "is_active", "slug"]

    def get_image(self, obj) -> None:
        """Превращает путь картики из базы в URL для загрузки фронтендом"""
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


    def validate(self, data):
        """Валидирует sku"""
        ProductValidator.validate_name(data.get("name"))
        ProductValidator.validate_sku(data.get("sku"))
        if data.get("slug"):
            ProductValidator.validate_slug(data.get("slug"))
        return data