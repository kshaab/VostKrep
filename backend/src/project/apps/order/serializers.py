from typing import Any, List

from rest_framework import serializers
from .models import Order, OrderItem
from .validators import OrderValidator, FileValidator, CartValidator



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
    items = serializers.JSONField(write_only=True, required=False)
    file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Order
        fields = (
            "name",
            "phone",
            "email",
            "address",
            "comment",
            "items",
            "file",
        )


    def validate_file(self, value):
        """Валидирует файл в заявке"""
        return FileValidator().validate(value)

    def validate_items(self, value):
        """Валидирует товары в корзине"""
        return CartValidator().validate(value)

    def validate_name(self, value):
        """Валидирует имя"""
        return OrderValidator().validate_name(value)

    def validate_email(self, value):
        """Валидирует почту"""
        return OrderValidator().validate_email(value)



    def create(self, validated_data):
        """Создает заказ и товары в заказе"""
        items_data = validated_data.pop("items", [])

        order = Order.objects.create(**validated_data)

        order_items = [
            OrderItem(
                order=order,
                product_name=item.get("product_name", "Товар"),
                option_size=item.get("option_size", ""),
                quantity=item.get("quantity", 1),
            )
            for item in items_data
        ]

        if order_items:
            OrderItem.objects.bulk_create(order_items)

        return order
