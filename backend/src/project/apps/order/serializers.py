from typing import Any, List

from rest_framework import serializers
from .models import Order, OrderItem
from .validators import OrderValidator
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
    items = OrderItemCreateSerializer(many=True, write_only=True)

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

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.validator = OrderValidator()

    def validate_name(self, value):
        return self.validator.validate_name(value)

    def validate_phone(self, value):
        return self.validator.validate_phone(value)

    def validate_email(self, value):
        return self.validator.validate_email(value)

    def validate_items(self, value: Any) -> List[dict]:
        if not value:
            raise serializers.ValidationError(
                "Корзина пуста. Добавьте товары."
            )
        return value

    def validate(self, data):
        data = self.validator.validate(data)
        return data

    def create(self, validated_data: Any) -> Order:
        items_data = validated_data.pop("items")

        order = Order.objects.create(**validated_data)

        option_ids = [item["option_id"] for item in items_data]

        options = {
            opt.id: opt
            for opt in ProductOption.objects.filter(
                id__in=option_ids,
                is_active=True
            ).select_related("product")
        }

        order_items = []

        for item in items_data:
            variant = options.get(item["option_id"])

            if not variant:
                raise serializers.ValidationError({
                    "items": f"Товар с id={item['option_id']} не найден или неактивен"
                })

            order_items.append(
                OrderItem(
                    order=order,
                    product_name=variant.product.name,
                    option_size=variant.size,
                    product_sku=str(variant.id),
                    quantity=item["quantity"],
                )
            )

        OrderItem.objects.bulk_create(order_items)

        return order
