from rest_framework import serializers
from .models import DeliveryPage, DeliveryItem, StaticPage, StaticPageItem, StaticPageSection


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
            "content",
            "seo_title",
            "seo_description",
            "items",
        ]

class StaticPageItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPageItem
        fields = ["title", "text"]

class StaticPageSectionSerializer(serializers.ModelSerializer):
    items = StaticPageItemSerializer(many=True)

    class Meta:
        model = StaticPageSection
        fields = ["title", "subtitle", "items"]

class StaticPageSerializer(serializers.ModelSerializer):
    sections = StaticPageSectionSerializer(many=True)

    class Meta:
        model = StaticPage
        fields = ["slug", "title", "content", "seo_title", "seo_description", "sections"]


