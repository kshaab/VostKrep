from io import StringIO

import pandas as pd
from django.core.management import call_command
from django.test import TestCase, override_settings
from unittest.mock import patch, Mock
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from project.apps.products.models import Product, Category, ProductOption
from project.apps.products.services import CacheCategories, CacheProducts


class ProductsViewTestCase(APITestCase):
    """Тесты для эндпоинтов продуктов и категорий"""

    @patch("project.apps.products.views.CacheProducts.get_products_from_cache")
    def test_get_products_without_category(self, mock_cache: Mock) -> None:
        category = Category.objects.create(slug="shoes", name="Shoes")
        product = Product.objects.create(slug="product-1", name="Product 1", category=category)
        mock_cache.return_value = [product]

        url = reverse("products:products-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Product 1")
        mock_cache.assert_called_once()

    @patch("project.apps.products.views.CacheProducts.get_product_list")
    def test_get_products_with_category(self, mock_cache):
        category = Category.objects.create(slug="shoes", name="Shoes")
        product = Product.objects.create(slug="product-1", name="Product 1", category=category)
        mock_cache.return_value = [product]  # объект модели

        url = reverse("products:products-list")
        response = self.client.get(url, {"category": "shoes"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Product 1")
        mock_cache.assert_called_once_with("shoes")

    @patch("project.apps.products.views.CacheCategories.get_category_list")
    def test_get_categories(self, mock_cache):
        # Создаём объект модели
        category = Category.objects.create(slug="shoes", name="Shoes", is_active=True)
        mock_cache.return_value = [category]  # <- объект модели

        url = reverse("products:category-list")  # имя маршрута CategoryViewSet list
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Shoes")
        mock_cache.assert_called_once()

class CacheProductsTestCase(TestCase):

    def setUp(self):
        self.category = Category.objects.create(slug="shoes", name="Shoes", is_active=True)
        self.product1 = Product.objects.create(slug="product-1", sku="SKU-001", name="Product 1", category=self.category, is_active=True)
        self.product2 = Product.objects.create(slug="product-2", sku="SKU-002", name="Product 2", category=self.category, is_active=True)

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_get_product_list_with_category(self, mock_set, mock_get):
        mock_get.return_value = None
        products = CacheProducts.get_product_list("shoes")
        self.assertEqual(list(products), [self.product1, self.product2])
        mock_set.assert_called_once()  # проверяем, что кеш вызван

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_get_products_from_cache(self, mock_set, mock_get):
        mock_get.return_value = None
        products = CacheProducts.get_products_from_cache()
        self.assertEqual(list(products), [self.product1, self.product2])
        mock_set.assert_called_once()


class CacheCategoriesTestCase(TestCase):

    def setUp(self):
        self.category1 = Category.objects.create(slug="shoes", name="Shoes", is_active=True)
        self.category2 = Category.objects.create(slug="shirts", name="Shirts", is_active=True)

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_get_category_list(self, mock_set, mock_get):
        mock_get.return_value = None
        categories = CacheCategories.get_category_list()
        self.assertEqual(list(categories), [self.category1, self.category2])
        mock_set.assert_called_once()


class ImportProductsCommandTest(TestCase):

    def setUp(self):
        # Создадим фиктивный Excel файл через pandas
        self.df = pd.DataFrame([
            {"Категория": "Категория 1", "Наименование": "Продукт A", "Артикул": "SKU1",
             "Описание": "Описание", "Единица измерения": "шт", "Размер": "M"}
        ])
        self.file_path = "test_products.xlsx"
        self.df.to_excel(self.file_path, index=False)

    def test_import_creates_objects(self):
        out = StringIO()
        call_command("products_import", self.file_path, stdout=out)

        # Проверяем категории
        category = Category.objects.get(name="Категория 1")
        self.assertIsNotNone(category)

        # Проверяем продукт
        product = Product.objects.get(sku="SKU1")
        self.assertEqual(product.name, "Продукт A")
        self.assertEqual(product.category, category)

        # Проверяем опцию
        option = ProductOption.objects.get(product=product, size="M")
        self.assertEqual(option.sku, "SKU1-M")

        # Проверяем вывод команды
        self.assertIn("Импорт завершён", out.getvalue())