from rest_framework import serializers
from .models import Order, OrderItem

# Сериализатор товаров
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("product_name", "quantity", "price",)
        read_only_fields = fields


# Входной сериализатор для фронта
class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
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
        )

    # Создание заказа
    # def create(self, validated_data):
    #     items_data = validated_data.pop("items")
    #     order = Order.objects.create(**validated_data)
    #     for item in items_data:
    #         try:
    #             variant = ProductOption.objects.get(
    #                 id=item["option_id"],
    #                 is_active=True
    #             )
    #         except ProductOption.DoesNotExist:
    #             raise serializers.ValidationError(
    #                 f"Размер не найден (id={item['option_id']})"
    #             )
    #
    #         OrderItem.objects.create(
    #             order=order,
    #             product_name=variant.product.name,
    #             variant_size=variant.size,
    #             quantity=item["quantity"],
    #             price=variant.price,
    #         )
    #
    #     return order


    # Валидация пустой корзины
    # def validate_items(self, value):
    #     if not value:
    #         raise serializers.ValidationError(
    #             "Корзина пуста. Добавьте товары из каталога."
    #         )
    #     return value
