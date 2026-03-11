import requests
from django.conf import settings


def send_telegram_order(order):
    """Отправляет сообщение о новой заявке в Телеграм-чат"""
    message = (
        f"Новая заявка #{order.id}\n\n"
        f"Имя: {order.name}\n"
        f"Телефон: {order.phone}\n"
        f"Email: {order.email}\n"
        f"Адрес: {order.address}\n"
        f"Комментарий: {order.comment}\n\n"
    )

    items = order.items.all()
    if items.exists():
        message += "Товары:\n"
        for item in items:
            message += f"- {item.product_name} (Размер: {item.option_size}) x {item.quantity}\n"

    if order.file:
        with open(order.file.path, "rb") as f:
            requests.post(
                f"{settings.TELEGRAM_URL}{settings.TELEGRAM_TOKEN}/sendDocument",
                data={
                    "chat_id": settings.TELEGRAM_CHAT_ID,
                    "caption": message
                },
                files={
                    "document": f
                },
                timeout=10
            )

    else:
        requests.get(
            f"{settings.TELEGRAM_URL}{settings.TELEGRAM_TOKEN}/sendMessage",
            params={
                "chat_id": settings.TELEGRAM_CHAT_ID,
                "text": message
            },
            timeout=10
        )

