from rest_framework import viewsets
from .models import Category, Product
from .serializers import ProductSerializer, CategorySerializer

# Вьюсет для продуктов, только чтение
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

# Вьюсет для категорий, только чтение
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer