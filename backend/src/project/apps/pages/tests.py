from unittest.mock import patch, Mock

import pytest
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from project.apps.pages.models import StaticPage, DeliveryPage
from project.apps.pages.services import CacheDeliveryPage, CacheStaticPage
from django.test import TestCase, override_settings

from project.apps.pages.validators import PageValidator


class PagesViewTestCase(APITestCase):
    """Тесты для эндпоинтов страницы доставки и статичных страниц"""

    @patch("project.apps.pages.views.CacheDeliveryPage.get_page")
    def test_delivery_page_list(self, mock_cache: Mock) -> None:
        """Тестирует вывод списка контента доставки"""

        mock_cache.return_value = {"title": "Доставка", "content": "Информация о доставке"}

        url = reverse("pages:delivery-page-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Доставка")
        self.assertEqual(response.data["content"], "Информация о доставке")
        mock_cache.assert_called_once()

    @patch("project.apps.pages.views.CacheStaticPage.get_page")
    def test_static_page_retrieve(self, mock_cache: Mock) -> None:
        """Тестирует вывод контента для статической страницы"""

        page = StaticPage.objects.create(slug="about", title="О нас", content="Информация о компании")
        mock_cache.return_value = page

        url = reverse("pages:static-page-detail", kwargs={"slug": "about"})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "О нас")
        self.assertEqual(response.data["content"], "Информация о компании")
        mock_cache.assert_called_once_with("about")


class CachePagesTestCase(TestCase):
    """Тесты кеширования статических страниц"""

    def setUp(self) -> None:
        self.delivery = DeliveryPage.objects.create(title="Доставка", content="Инфо")
        self.static = StaticPage.objects.create(slug="about", title="О нас", content="Компания")

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_cache_delivery_page_get_page(self, mock_set: Mock, mock_get: Mock) -> None:
        """Тестирует кеширование страницы доставки"""
        mock_get.return_value = None
        page = CacheDeliveryPage.get_page()
        self.assertEqual(page, self.delivery)
        mock_set.assert_called_once_with("delivery_page", self.delivery, timeout=60*60)

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_cache_static_page_get_page(self, mock_set: Mock, mock_get: Mock) -> None:
        """Тестирует кеширование статических страниц"""
        mock_get.return_value = None
        page = CacheStaticPage.get_page("about")
        self.assertEqual(page, self.static)
        mock_set.assert_called_once_with("page:about", self.static, timeout=60*60)


class TestPageValidator:
    """Тест валидаторов страниц"""

    def test_validate_title_valid(self):
        """Тестирует валидность заголовка"""
        assert PageValidator.validate_title("My Page") == "My Page"

    def test_validate_title_empty(self):
        """Тестирует валидность заголовка (пустой)"""
        with pytest.raises(ValidationError):
            PageValidator.validate_title("   ")

    def test_validate_title_too_long(self):
        """Тестирует длину заголовка"""
        with pytest.raises(ValidationError):
            PageValidator.validate_title("A" * 256)

    def test_validate_text_valid(self):
        """Тестирует валидность контента страницы"""
        assert PageValidator.validate_text("Some content") == "Some content"

    def test_validate_text_empty(self):
        """Тестирует валидность контента страницы (пустой)"""
        with pytest.raises(ValidationError):
            PageValidator.validate_text("   ")

    def test_validate_seo_title_valid(self):
        """Тестирует валидность seo_title"""
        assert PageValidator.validate_seo_title("SEO Title") == "SEO Title"

    def test_validate_seo_title_too_long(self):
        """Тестирует длину seo_title"""
        with pytest.raises(ValidationError):
            PageValidator.validate_seo_title("A" * 256)

    def test_validate_order_valid(self):
        """Тестирует валидность очередности"""
        assert PageValidator.validate_order(5) == 5

    def test_validate_order_negative(self):
        """Тестирует валидность очередности (не может быть отрицательной)"""
        with pytest.raises(ValidationError):
            PageValidator.validate_order(-1)