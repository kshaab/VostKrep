from unittest.mock import Mock, mock_open, patch

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from project.apps.order.models import Order, OrderItem
from project.apps.order.services import send_telegram_order
from project.apps.order.tasks import send_order_to_telegram
from project.apps.order.validators import CartValidator, FileValidator, OrderValidator
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.test import APITestCase


class OrderTestCase(APITestCase):
    """Тест заявок"""

    @patch("project.apps.order.views.send_order_to_telegram.delay")
    def test_order_create_with_items(self, mock_send: Mock):
        """Тестирует создание заявки с товарами"""
        url = reverse("order:order-create")

        import json

        data = {
            "name": "Иван Иванов",
            "phone": "+71234567890",
            "email": "test@example.com",
            "comment": "Тест",
            "items": json.dumps([{"product_name": "Болт", "option_size": "М8", "quantity": 2}]),
        }

        response = self.client.post(url, data, format="multipart")

        assert response.status_code == 201
        assert Order.objects.count() == 1

        order = Order.objects.first()
        mock_send.assert_called_once_with(order.id)

    @patch("project.apps.order.views.send_order_to_telegram.delay")
    def test_order_create_with_file_only(self, mock_send: Mock):
        """Тестирует создание заявки с файлом"""
        url = reverse("order:order-create")

        file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")

        data = {
            "name": "Иван Иванов",
            "phone": "+71234567890",
            "file": file,
        }

        response = self.client.post(url, data, format="multipart")

        assert response.status_code == 201
        assert Order.objects.count() == 1

        order = Order.objects.first()
        assert order.file is not None
        mock_send.assert_called_once_with(order.id)


class OrderTaskTestCase(APITestCase):
    """Тест Celery задачи"""

    def setUp(self):
        """Тестовые данные"""
        self.order = Order.objects.create(name="Иван Иванов", phone="+79991234567", email="test@example.com")

    @patch("project.apps.order.tasks.send_telegram_order")
    def test_send_order_success(self, mock_send: Mock):
        """Тестирует отправку заявки в Телеграм"""
        send_order_to_telegram(self.order.id)

        mock_send.assert_called_once_with(self.order)

    @patch("project.apps.order.tasks.send_telegram_order")
    def test_order_not_found(self, mock_send: Mock):
        """Тестирует не найденную заявку"""
        with self.assertLogs(level="ERROR") as log:
            send_order_to_telegram(999)

        mock_send.assert_not_called()
        assert "Заявка 999 не найдена" in log.output[0]

    @patch("project.apps.order.tasks.send_telegram_order")
    def test_send_order_to_telegram_order_not_found(self, mock_send: Mock) -> None:
        """Тестирует поиск несуществующей заявки"""
        with self.assertLogs(level="ERROR") as log_cm:
            send_order_to_telegram(999)

        mock_send.assert_not_called()
        self.assertIn("Заявка 999 не найдена", log_cm.output[0])


class TelegramServiceTestCase(TestCase):
    """Тест функции отправки заявки"""

    def setUp(self):
        """Тестовые данные"""
        self.order = Order.objects.create(
            name="Иван Иванов", phone="+79991234567", email="test@example.com", comment="Тест"
        )

        OrderItem.objects.create(order=self.order, product_name="Болт", option_size="М8", quantity=2)

    @patch("project.apps.order.services.requests.get")
    def test_send_without_file(self, mock_get: Mock):
        """Тестирует отправку без файла"""
        send_telegram_order(self.order)

        mock_get.assert_called_once()

        _, kwargs = mock_get.call_args
        assert str(self.order.id) in kwargs["params"]["text"]

    @patch("project.apps.order.services.requests.post")
    @patch("project.apps.order.services.open", new_callable=mock_open, read_data=b"file")
    def test_send_with_file(self, mock_file: Mock, mock_post: Mock):
        """Тестирует отправку с файлом"""
        self.order.file.name = "test.pdf"

        send_telegram_order(self.order)

        mock_post.assert_called_once()
        mock_file.assert_called_once()


class TestOrderValidator:
    """Тест валидатора заявки"""

    @pytest.fixture
    def validator(self):
        """Фикстура валидатора заявки"""
        return OrderValidator()

    def test_validate_name(self, validator):
        """Тестирует валидацию имени"""
        assert validator.validate_name("Иван") == "Иван"

    def test_validate_name_fail(self, validator):
        """Тестирует валидацию почты"""
        with pytest.raises(DRFValidationError):
            validator.validate_name("   ")

    def test_validate_email_valid(self, validator):
        """Тестирует валидацию почты"""
        assert validator.validate_email("test@mail.com") == "test@mail.com"

    def test_validate_email_invalid(self, validator):
        """Тестирует валидацию почты"""
        with pytest.raises(DRFValidationError):
            validator.validate_email("badmail")

    def test_comment_ok(self, validator):
        """Тестирует валидацию комментария"""
        data = {"comment": "A" * 500}
        assert validator.validate(data) == data

    def test_comment_fail(self, validator):
        """Тестирует валидацию комментария"""
        with pytest.raises(DRFValidationError):
            validator.validate({"comment": "A" * 501})


class TestCartValidator:
    """Тест валидатора корзины"""

    def test_valid_cart(self):
        """Тестирует валидатор корзины"""
        data = [{"quantity": 2}]
        assert CartValidator().validate(data) == data

    def test_json_string(self):
        """Тестирует формат данных в корзине"""
        data = '[{"quantity": 2}]'
        result = CartValidator().validate(data)
        assert isinstance(result, list)

    def test_invalid_format(self):
        """Тестирует формат данных в корзине"""
        with pytest.raises(DRFValidationError):
            CartValidator().validate("bad json")

    def test_negative_quantity(self):
        """Тестирует валидность количества товаров в корзине"""
        with pytest.raises(DRFValidationError):
            CartValidator().validate([{"quantity": 0}])


class TestFileValidator:
    """Тест файла в заявке"""

    def test_valid_file(self):
        """Тестирует валидатор файла"""
        file = SimpleUploadedFile("test.pdf", b"data", content_type="application/pdf")

        assert FileValidator().validate(file) == file

    def test_invalid_type(self):
        """Тестирует валидность типа файла"""
        file = SimpleUploadedFile("test.txt", b"data", content_type="text/plain")

        with pytest.raises(DRFValidationError):
            FileValidator().validate(file)

    def test_too_large(self):
        """Тестирует валидность размера файла"""
        file = SimpleUploadedFile("test.pdf", b"a" * (51 * 1024 * 1024), content_type="application/pdf")

        with pytest.raises(DRFValidationError):
            FileValidator().validate(file)
