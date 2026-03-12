from rest_framework import generics, status
from rest_framework.response import Response

from .models import Order
from.serializers import OrderSerializer
from rest_framework.throttling import AnonRateThrottle
from rest_framework.parsers import MultiPartParser, FormParser
import logging

from .tasks import send_order_to_telegram

logger = logging.getLogger(__name__)

# Вьюсет для создания заявки
class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    throttle_classes = [AnonRateThrottle]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        order = serializer.save()
        send_order_to_telegram.delay(order.id)


    def create(self, request, *args, **kwargs):
        """Создает кастомный ответ при успешной отправке заявки"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"success": True, "message": "Заявка успешно отправлена"},
            status=status.HTTP_201_CREATED
        )



