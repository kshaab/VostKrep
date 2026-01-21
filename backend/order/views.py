from rest_framework import viewsets, generics
from .models import Order
from .serializers import OrderSerializer
from rest_framework.throttling import AnonRateThrottle
import logging

# logger = logging.getLogger(__name__)

# Вьюсет для создания заявки
class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    throttle_classes = [AnonRateThrottle]


    # Кастомный ответ при отправке заявки для фронта
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #
    #     return Response(
    #         {"detail": "Заявка успешно отправлена"},
    #         status=status.HTTP_201_CREATED
    #     )

    # Отправка письма
    # def perform_create(self, serializer):
    #     order = serializer.save()
    #     try:
    #         send_order_email(order)
    #     except Exception as e:
    #         logger.error(f"Email error for order {order.id}: {e}")


