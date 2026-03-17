from rest_framework import serializers
import re


class OrderValidator:
    """Валидация заказа"""

    def validate_name(self, value: str) -> str:
        if not value.strip():
            raise serializers.ValidationError("Имя не может быть пустым")
        return value

    def validate_phone(self, value: str) -> str:
        if not re.fullmatch(r"\+7\d{10}", value):
            raise serializers.ValidationError(
                "Телефон должен быть в формате +7XXXXXXXXXX"
            )
        return value

    def validate_email(self, value: str) -> str:
        if value and "@" not in value:
            raise serializers.ValidationError("Некорректный email")
        return value

    def validate(self, data: dict) -> dict:
        comment = data.get("comment", "")
        if len(comment) > 500:
            raise serializers.ValidationError({
                "comment": "Комментарий слишком длинный"
            })
        return data