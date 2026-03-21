import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(override=True)

BASE_DIR = Path(__file__).resolve().parent.parent

os.makedirs("logs", exist_ok=True)


def parse_origins(value: str) -> list[str]:
    return [v.strip() for v in value.split(",") if v.strip()]


SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = True if os.getenv("DEBUG") == "True" else False

ALLOWED_HOSTS = parse_origins(os.getenv("ALLOWED_HOSTS", ""))

INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "project.apps.order",
    "project.apps.products",
    "project.apps.pages",
    "axes",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "axes.middleware.AxesMiddleware",
]

ROOT_URLCONF = "project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / ""],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


CORS_ALLOWED_ORIGINS = parse_origins(os.getenv("CORS_ALLOWED_ORIGINS", ""))
CSRF_TRUSTED_ORIGINS = parse_origins(os.getenv("CSRF_TRUSTED_ORIGINS", ""))

CORS_ALLOW_CREDENTIALS = True

WSGI_APPLICATION = "project.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB"),
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "127.0.0.1"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Moscow"

USE_I18N = True

USE_TZ = True

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "static"

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"

REST_FRAMEWORK = {"DEFAULT_THROTTLE_RATES": {"anon": "10/min", "orders": "5/min"}}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL")

CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND")

CELERY_TIMEZONE = "Europe/Moscow"

CELERY_TASK_TRACK_STARTED = True

CELERY_TASK_TIME_LIMIT = 30 * 60

TELEGRAM_URL = "https://api.telegram.org/bot"

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

JAZZMIN_SETTINGS = {
    "site_title": "Администратор",
    "site_header": "Управление каталогом",
    "site_brand": "VostKrep",
    "welcome_sign": "Добро пожаловать, менеджер",
    "icons": {
        "app.Product": "fas fa-box",
        "auth.user": "fas fa-user",
    },
    "topmenu_links": [
        {"name": "Каталог", "url": "http://89.169.160.28", "new_window": True},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
}

AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesBackend",
    "django.contrib.auth.backends.ModelBackend",
]

AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1

LOGGING = {
    "version": 1,
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "logs/admin.log",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "INFO",
        },
    },
}
