import json

from rest_framework import serializers


class OrderValidator:
    """Валидатор заявки"""

    def validate_name(self, value: str) -> str:
        """Валидирует имя"""
        if not value.strip():
            raise serializers.ValidationError("Имя не может быть пустым")
        return value

    def validate_email(self, value: str) -> str:
        """Валидирует почту"""
        if value and "@" not in value:
            raise serializers.ValidationError("Некорректный email")
        return value

    def validate_comment(self, data: dict) -> dict:
        """Валидирует комментарий"""
        comment = data.get("comment", "")
        if len(comment) > 500:
            raise serializers.ValidationError({"comment": "Комментарий слишком длинный"})
        return data


ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

MAX_FILE_SIZE = 50 * 1024 * 1024


class FileValidator:
    """Валидатор файла"""

    def validate(self, file):
        """Валидирует размер и формат файла"""
        if not file:
            return file

        if file.content_type not in ALLOWED_FILE_TYPES:
            raise serializers.ValidationError("Только PDF, DOC, DOCX, XLS, XLSX")

        if file.size > MAX_FILE_SIZE:
            raise serializers.ValidationError("Максимум 50MB")

        return file


class CartValidator:
    """Валидатор корзины"""

    def validate(self, items):
        """Валидирует формат списка товаров и их количества"""
        if not items:
            return []

        if isinstance(items, str):
            try:
                items = json.loads(items)
            except Exception:
                raise serializers.ValidationError("Некорректный JSON корзины")

        if not isinstance(items, list):
            raise serializers.ValidationError("items должен быть списком")

        for item in items:
            if not isinstance(item, dict):
                raise serializers.ValidationError("Неверный формат товара")

            if item.get("quantity", 0) <= 0:
                raise serializers.ValidationError("Количество должно быть > 0")

        return items
