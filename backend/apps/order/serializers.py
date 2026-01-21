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
    #
    #     order = Order.objects.create(**validated_data)
    #
    #     from products.models import Product
    #
    #     for item in items_data:
    #         product = Product.objects.get(id=item["product_id"])
    #
    #         OrderItem.objects.create(
    #             order=order,
    #             product_name=product.name,
    #             quantity=item["quantity"],
    #             price=product.price,
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
