import logging

from celery import shared_task

from .models import Order
from .services import send_telegram_order

logger = logging.getLogger(__name__)


@shared_task
def send_order_to_telegram(order_id: int) -> None:
    """Отправляет заявку в ТГ-бот"""
    try:
        order = Order.objects.get(id=order_id)
        send_telegram_order(order)

    except Order.DoesNotExist:
        logger.error(f"Заявка {order_id} не найдена")

    except Exception as e:
        logger.error(f"Ошибка отправки в Telegram: {str(e)}")
        raise e
