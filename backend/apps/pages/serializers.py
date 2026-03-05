from rest_framework import serializers
from .models import DeliveryPage

class DeliveryPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPage
        fields = "__all__"