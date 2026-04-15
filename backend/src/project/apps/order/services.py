import requests
from django.conf import settings
from project.apps.order.models import Order


def send_telegram_order(order: Order) -> None:
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
            message += f"- {item.product_name} x {item.quantity} {item.unit}\n"

    try:
        if order.file:
            with open(order.file.path, "rb") as f:
                response = requests.post(
                    f"{settings.TELEGRAM_URL}{settings.TELEGRAM_TOKEN}/sendDocument",
                    data={
                        "chat_id": settings.TELEGRAM_CHAT_ID,
                        "caption": message,
                    },
                    files={"document": f},
                    timeout=10,
                )
        else:
            response = requests.get(
                f"{settings.TELEGRAM_URL}{settings.TELEGRAM_TOKEN}/sendMessage",
                params={
                    "chat_id": settings.TELEGRAM_CHAT_ID,
                    "text": message,
                },
                timeout=10,
            )

        print("TELEGRAM STATUS:", response.status_code)
        print("TELEGRAM RESPONSE:", response.text)

        response.raise_for_status()

    except Exception as e:
        print("TELEGRAM ERROR:", str(e))
        raise e
