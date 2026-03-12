from django.apps import AppConfig


class PagesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "project.apps.pages"

    def ready(self):
        __import__(f"{self.name}.signals")