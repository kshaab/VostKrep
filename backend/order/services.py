# Отправка заявки письмом на почту

# from django.core.mail import send_mail
#
# def send_order_email(order):
#     items = order.items.all()
#
#     message = f"""
# Новая заявка #{order.id}
#
# Имя: {order.name}
# Телефон: {order.phone}
# Email: {order.email}
# Адрес: {order.address}
# Комментарий {order.comment}

# Товары:
# """
#
#     for item in items:
#         message += f"- {item.product_name} x {item.quantity}\n"
#
#     send_mail(
#         subject="Новая заявка с сайта",
#         message=message,
#         from_email=None,
#         recipient_list=["shop@mail.ru"],
#     )
