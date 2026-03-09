from rest_framework import serializers
from .models import DeliveryPage, DeliveryItem

class DeliveryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryItem
        fields = ["id", "text", "order"]


class DeliveryPageSerializer(serializers.ModelSerializer):
    items = DeliveryItemSerializer(many=True, read_only=True)

    class Meta:
        model = DeliveryPage
        fields = [
            "title",
            "slug",
            "content",
            "seo_title",
            "seo_description",
            "items",
        ]