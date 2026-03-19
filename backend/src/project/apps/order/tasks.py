import logging

from celery import shared_task

from .models import Order
from .services import send_telegram_order

logger = logging.getLogger(__name__)


@shared_task
def send_order_to_telegram(order_id: int) -> None:
    """Celery задача для отправки заявки в Телеграм"""

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        logger.error(f"Заявка {order_id} не найдена")
        return

    send_telegram_order(order)
