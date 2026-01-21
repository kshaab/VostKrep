from rest_framework import serializers
from .models import Category, Product

# Сериализатор продуктов
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "sku", "category", "description", "price", "unit", "image", "is_active", "created_at"]


# Сериализатор категорий
class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ["name", "parent", "image", "is_active", "products"]