from django.core.exceptions import ValidationError


class PageValidator:
    """Валидация страниц, секций и элементов"""

    @staticmethod
    def validate_title(value: str, field_name: str = "title"):
        """Валидирует заголовок"""
        if not value.strip():
            raise ValidationError({field_name: f"{field_name.capitalize()} не может быть пустым"})
        if len(value) > 255:
            raise ValidationError({field_name: f"{field_name.capitalize()} слишком длинное (макс 255 символов)"})
        return value

    @staticmethod
    def validate_text(value: str, field_name: str = "text"):
        """Валидирует текст страницы"""
        if not value.strip():
            raise ValidationError({field_name: f"{field_name.capitalize()} не может быть пустым"})
        return value

    @staticmethod
    def validate_seo_title(value: str):
        """Валидирует seo_title"""
        if value and len(value) > 255:
            raise ValidationError({"seo_title": "SEO title слишком длинный (макс 255 символов)"})
        return value

    @staticmethod
    def validate_seo_description(value: str):
        """Валидирует seo_description"""
        if value and len(value) > 1000:
            raise ValidationError({"seo_description": "SEO description слишком длинный (макс 1000 символов)"})
        return value

    @staticmethod
    def validate_order(value: int, field_name: str = "order"):
        """Валидирует очередность"""
        if value < 0:
            raise ValidationError({field_name: f"{field_name.capitalize()} не может быть отрицательным"})
        return value

    @classmethod
    def validate_page(cls, title: str, content: str, seo_title: str = "", seo_description: str = ""):
        """Валидирует страницу"""
        cls.validate_title(title, "title")
        if content:
            cls.validate_text(content, "content")
        cls.validate_seo_title(seo_title)
        cls.validate_seo_description(seo_description)

    @classmethod
    def validate_item(cls, title: str, text: str, order: int = 0):
        """Валидирует элементы на странице"""
        cls.validate_title(title, "title")
        cls.validate_text(text, "text")
        cls.validate_order(order, "order")
