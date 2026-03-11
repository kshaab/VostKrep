from rest_framework import serializers
from .models import Order, OrderItem
from ..products.models import ProductOption


# Сериализатор товаров
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("product_name", "quantity",)
        read_only_fields = fields


# Входной сериализатор для фронта
class OrderItemCreateSerializer(serializers.Serializer):
    option_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


# Сериализатор заявки
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Order
        fields = (
            "name",
            "phone",
            "email",
            "address",
            "comment",
            "items",
        )


    def create(self, validated_data):
        """Создает заказ"""
        items_data = validated_data.pop("items", [])
        order = Order.objects.create(**validated_data)
        for item in items_data:
            variant = ProductOption.objects.get(id=item["option_id"], is_active=True)
            OrderItem.objects.create(
                order=order,
                product_name=variant.product.name,
                option_size=variant.size,
                quantity=item["quantity"],
            )
        return order



    def validate_items(self, value):
        """Валидирует пустую корзину"""
        if not value:
            raise serializers.ValidationError(
                "Корзина пуста. Добавьте товары из каталога."
            )
        return value
