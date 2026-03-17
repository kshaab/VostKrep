from django.test import TestCase

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch, mock_open, Mock
from project.apps.order.models import Order, OrderItem
from project.apps.order.services import send_telegram_order
from project.apps.order.tasks import send_order_to_telegram


class OrderTestCase(APITestCase):
    """Тестирование эндпоинтов заявок"""

    @patch("project.apps.order.views.send_order_to_telegram.delay")
    def test_order_create_success(self, mock_send: Mock) -> None:
        """Тестирует успешное создание заявки"""
        url = reverse("order:order-create")

        data = {
            "name": "Иван Иванов",
            "phone": "+79991234567",
            "email": "test@example.com",
            "comment": "Тестовая заявка",
            "file": SimpleUploadedFile("test.txt", b"content")
        }

        response = self.client.post(url, data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["success"], True)
        self.assertIn("Заявка успешно отправлена", response.data["message"])


        self.assertEqual(Order.objects.count(), 1)
        order = Order.objects.first()
        self.assertEqual(order.name, data["name"])


        mock_send.assert_called_once_with(order.id)

    @patch("project.apps.order.views.send_order_to_telegram.delay")
    def test_order_create_invalid(self, mock_send: Mock) -> None:
        """Тестирует создание заявки с некорректными данными"""
        url = reverse("order:order-create")

        response = self.client.post(url, data={}, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)
        mock_send.assert_not_called()


class OrderTaskTestCase(APITestCase):
    """Тестирование Celery задачи"""

    def setUp(self) -> None:
        self.order = Order.objects.create(
            name="Иван Иванов",
            phone="+79991234567",
            email="test@example.com"
        )

    @patch("project.apps.order.tasks.send_telegram_order")
    def test_send_order_to_telegram_success(self, mock_send: Mock) -> None:
        """Тестирует успешную отправку заявки"""
        send_order_to_telegram(self.order.id)

        mock_send.assert_called_once_with(self.order)

    @patch("project.apps.order.tasks.send_telegram_order")
    def test_send_order_to_telegram_order_not_found(self, mock_send: Mock) -> None:
        """Тестирует поиск несуществующей заявки"""
        with self.assertLogs(level='ERROR') as log_cm:
            send_order_to_telegram(999)

        mock_send.assert_not_called()
        self.assertIn("Заявка 999 не найдена", log_cm.output[0])

class TelegramServiceTestCase(TestCase):
    """Тесты функции отправки заявки в Telegram"""

    def setUp(self) -> None:
        self.order = Order.objects.create(
            name="Иван Иванов",
            phone="+79991234567",
            email="test@example.com",
            comment="Тестовый заказ"
        )


        self.item = OrderItem.objects.create(
            order=self.order,
            product_name="Болт",
            option_size="М8х30",
            quantity=2
        )

    @patch("project.apps.order.services.requests.get")
    def test_send_telegram_order_without_file(self, mock_get: Mock) -> None:
        """Тестирует отправку сообщения без файла"""
        send_telegram_order(self.order)
        mock_get.assert_called_once()
        args, kwargs = mock_get.call_args
        assert str(self.order.id) in kwargs["params"]["text"]

    @patch("project.apps.order.services.requests.post")
    @patch("builtins.open", new_callable=mock_open, read_data=b"file content")
    def test_send_telegram_order_with_file(self, mock_file: Mock, mock_post: Mock) -> None:
        """Тестирует отправку сообщения с файлом"""

        self.order.file.name = "test.txt"
        self.order.save()

        send_telegram_order(self.order)

        mock_post.assert_called_once()

        mock_file.assert_called_once_with(self.order.file.path, "rb")

