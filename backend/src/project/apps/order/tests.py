from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from project.apps.order.models import Order



class OrderTestCase(APITestCase):


    @patch("project.apps.order.views.send_order_to_telegram.delay")
    def test_order_create_success(self, mock_send) -> None:
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
    def test_order_create_invalid(self, mock_send) -> None:
        """Тестирует создание заявки с некорректными данными"""
        url = reverse("order:order-create")

        response = self.client.post(url, data={}, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)
        mock_send.assert_not_called()

