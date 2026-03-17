from django.core.exceptions import ValidationError
import re

class ProductValidator:
    """Валидация категорий, продуктов и опций товаров"""

    @staticmethod
    def validate_name(value: str, field_name: str = "name"):
        if not value.strip():
            raise ValidationError({field_name: f"{field_name.capitalize()} не может быть пустым"})
        if len(value) > 150:
            raise ValidationError({field_name: f"{field_name.capitalize()} слишком длинное (макс 150 символов)"})
        return value

    @staticmethod
    def validate_sku(value: str, field_name: str = "sku"):
        if not value.strip():
            raise ValidationError({field_name: f"{field_name.capitalize()} не может быть пустым"})
        if len(value) > 150:
            raise ValidationError({field_name: f"{field_name.capitalize()} слишком длинное (макс 150 символов)"})
        return value

    @staticmethod
    def validate_slug(value: str, field_name: str = "slug"):
        if not re.fullmatch(r"[-a-zA-Z0-9_]+", value):
            raise ValidationError({field_name: "Slug может содержать только буквы, цифры, тире и подчеркивания"})
        return value

    @staticmethod
    def validate_order(value: int, field_name: str = "order"):
        if value < 0:
            raise ValidationError({field_name: f"{field_name.capitalize()} не может быть отрицательным"})
        return value