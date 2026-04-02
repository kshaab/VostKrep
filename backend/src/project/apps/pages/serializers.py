from rest_framework import serializers

from .models import DeliveryItem, DeliveryPage, DeliveryZone, StaticPage, StaticPageItem, StaticPageSection
from .validators import PageValidator


class DeliveryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryItem
        fields = ["id", "title", "text", "order"]

    def validate(self, data):
        PageValidator.validate_item(title=data.get("title", ""), text=data.get("text", ""), order=data.get("order", 0))
        return data


class DeliveryZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryZone
        fields = ["color", "text"]


class DeliveryPageSerializer(serializers.ModelSerializer):
    items = DeliveryItemSerializer(many=True, read_only=True)
    zones = DeliveryZoneSerializer(many=True, read_only=True)

    class Meta:
        model = DeliveryPage
        fields = ["title", "content", "seo_title", "seo_description", "items", "zones"]

    def validate(self, data):
        PageValidator.validate_page(
            title=data.get("title", ""),
            content=data.get("content", ""),
            seo_title=data.get("seo_title", ""),
            seo_description=data.get("seo_description", ""),
        )
        return data


class StaticPageItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPageItem
        fields = ["title", "text", "order"]

    def validate(self, data):
        PageValidator.validate_item(title=data.get("title", ""), text=data.get("text", ""), order=data.get("order", 0))
        return data


class StaticPageSectionSerializer(serializers.ModelSerializer):
    items = StaticPageItemSerializer(many=True)

    class Meta:
        model = StaticPageSection
        fields = ["title", "subtitle", "order", "items"]

    def validate(self, data):
        PageValidator.validate_item(
            title=data.get("title", ""), text=data.get("subtitle", ""), order=data.get("order", 0)
        )
        return data


class StaticPageSerializer(serializers.ModelSerializer):
    sections = StaticPageSectionSerializer(many=True)

    class Meta:
        model = StaticPage
        fields = ["slug", "title", "content", "seo_title", "seo_description", "sections"]

    def validate(self, data):
        PageValidator.validate_page(
            title=data.get("title", ""),
            content=data.get("content", ""),
            seo_title=data.get("seo_title", ""),
            seo_description=data.get("seo_description", ""),
        )
        return data
