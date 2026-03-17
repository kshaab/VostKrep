import pytest
from io import StringIO
import pandas as pd

from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse
from unittest.mock import patch, Mock

from rest_framework.test import APITestCase
from django.core.exceptions import ValidationError


from project.apps.products.validators import ProductValidator
from project.apps.products.models import Product, Category, ProductOption
from project.apps.products.pagination import ProductPagination, CategoryPagination
from project.apps.products.services import CacheCategories, CacheProducts



class TestProductValidator:
    """Тест валидаторов продукта"""

    def test_validate_name_valid(self):
        """Тестирует валидность названия"""
        assert ProductValidator.validate_name("Product") == "Product"

    def test_validate_name_empty(self):
        """Тестирует валидность названия (пустое)"""
        with pytest.raises(ValidationError):
            ProductValidator.validate_name("   ")

    def test_validate_name_too_long(self):
        """Тестирует валидность названия (длина)"""
        with pytest.raises(ValidationError):
            ProductValidator.validate_name("A" * 151)

    def test_validate_sku_valid(self):
        """Тестирует валидность артикула"""
        assert ProductValidator.validate_sku("SKU123") == "SKU123"

    def test_validate_sku_empty(self):
        """Тестирует валидность артикула (пустое)"""
        with pytest.raises(ValidationError):
            ProductValidator.validate_sku("   ")

    def test_validate_slug_valid(self):
        """Тестирует валидность slug"""
        assert ProductValidator.validate_slug("valid-slug_123") == "valid-slug_123"

    def test_validate_slug_invalid(self):
        """Тестирует валидность slug (неверное значение)"""
        with pytest.raises(ValidationError):
            ProductValidator.validate_slug("invalid slug!")

    def test_validate_order_valid(self):
        """Тестирует валидность сортировки"""
        assert ProductValidator.validate_order(0) == 0

    def test_validate_order_negative(self):
        """Тестирует валидность сортировки (не может быть отрицательной)"""
        with pytest.raises(ValidationError):
            ProductValidator.validate_order(-1)


class TestPagination:
    """Тест пагинации"""

    def test_product_pagination_defaults(self):
        """Тестирует значение пагинации продуктов по умолчанию"""
        paginator = ProductPagination()
        assert paginator.page_size == 20
        assert paginator.max_page_size == 100

    def test_category_pagination_defaults(self):
        """Тестирует значение пагинации категорий по умолчанию"""
        paginator = CategoryPagination()
        assert paginator.page_size == 50
        assert paginator.max_page_size == 200


class ProductsViewTestCase(APITestCase):
    """Тест эндпоинтов продуктов"""

    def setUp(self):
        """Тестовые данные"""
        Product.objects.all().delete()
        Category.objects.all().delete()

    def test_get_products_without_category(self):
        """Тестирует продукт без категории"""
        category = Category.objects.create(slug="bolty", name="Bolty")
        Product.objects.create(
            slug="product-1", name="Product 1", category=category, sku="SKU1"
        )

        url = reverse("products:products-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)


    def test_get_products_with_category(self):
        """Тестирует продукт с категорией"""
        Product.objects.all().delete()
        Category.objects.all().delete()

        category = Category.objects.create(slug="bolty", name="Bolty")
        Product.objects.create(slug="product-1", name="Product 1", category=category, sku="SKU1")
        Product.objects.create(slug="product-2", name="Product 2", category=category, sku="SKU2")

        url = reverse("products:products-list")
        response = self.client.get(url, {"category": "bolty"})
        self.assertEqual(response.status_code, 200)

        data = response.data["results"]
        self.assertEqual(len(data), 2)
        self.assertTrue(all(p["name"].startswith("Product") for p in data))

    def test_get_categories(self):
        """Тестирует категории"""
        Category.objects.create(slug="bolty", name="Bolty", is_active=True)
        Category.objects.create(slug="shurupy", name="Shurupy", is_active=True)

        url = reverse("products:category-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        data = response.data["results"]

        self.assertIn("Bolty", [c["name"] for c in data])
        self.assertIn("Shurupy", [c["name"] for c in data])


class CacheProductsTestCase(TestCase):
    """Тест кеширования продуктов"""

    def setUp(self):
        """Тестовые данные"""
        Product.objects.all().delete()
        Category.objects.all().delete()
        self.category = Category.objects.create(slug="bolty", name="Bolty", is_active=True)
        self.product1 = Product.objects.create(slug="product-1", sku="SKU-001", name="Product 1", category=self.category, is_active=True)
        self.product2 = Product.objects.create(slug="product-2", sku="SKU-002", name="Product 2", category=self.category, is_active=True)

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_get_product_list_with_category(self, mock_set, mock_get):
        """Тестирует кеширование списка продуктов с категорией"""
        mock_get.return_value = None
        products = CacheProducts.get_product_list("bolty")
        self.assertEqual(list(products), [self.product1, self.product2])
        mock_set.assert_called_once()

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_get_products_from_cache(self, mock_set, mock_get):
        """Тестирует возврат продукта из кеша"""
        mock_get.return_value = None
        products = CacheProducts.get_products_from_cache()
        self.assertEqual(list(products), [self.product1, self.product2])
        mock_set.assert_called_once()


class CacheCategoriesTestCase(TestCase):
    """Тест кеширования категорий"""
    def setUp(self):
        """Тестовые данные"""
        Product.objects.all().delete()
        Category.objects.all().delete()
        self.category1 = Category.objects.create(slug="bolty", name="Bolty", is_active=True)
        self.category2 = Category.objects.create(slug="shurupy", name="Shurupy", is_active=True)

    @override_settings(CACHE_ENABLED=True)
    @patch("django.core.cache.cache.get")
    @patch("django.core.cache.cache.set")
    def test_get_category_list(self, mock_set, mock_get):
        """Тестирует возврат списка категорий"""
        mock_get.return_value = None
        categories = CacheCategories.get_category_list()
        self.assertEqual(list(categories), [self.category1, self.category2])
        mock_set.assert_called_once()


class ImportProductsCommandTest(TestCase):
    """Тест команды для импорта данных в БД"""

    def setUp(self):
        """Тестовые данные"""
        Product.objects.all().delete()
        Category.objects.all().delete()
        self.df = pd.DataFrame([
            {"Категория": "Категория 1", "Наименование": "Продукт A", "Артикул": "SKU1",
             "Описание": "Описание", "Единица измерения": "шт", "Размер": "M"}
        ])
        self.file_path = "test_products.xlsx"
        self.df.to_excel(self.file_path, index=False)

    def test_import_creates_objects(self):
        """Тестирует создание объектов в БД после импорта"""
        out = StringIO()
        call_command("products_import", self.file_path, stdout=out)

        category = Category.objects.get(name="Категория 1")
        self.assertIsNotNone(category)

        product = Product.objects.get(sku="SKU1")
        self.assertEqual(product.name, "Продукт A")
        self.assertEqual(product.category, category)

        option = ProductOption.objects.get(product=product, size="M")
        self.assertEqual(option.sku, "SKU1-M")

        self.assertIn("Импорт завершён", out.getvalue())