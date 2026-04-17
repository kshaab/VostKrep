# VostKrep

### Веб-сайт каталог для поставщика крепежа, разработанный на **Django** + **Next.js**.  

### Проект в разработке.

### Проект включает:
- backend API (Django + DRF)
- frontend (Next.js)
- фоновые задачи (Celery + Redis)
- PostgreSQL

## Содержание 

- [Технологии](#технологии)
- [Использование](#использование)
- [Структура проекта](#структура-проекта)
- [Зависимости](#зависимости)
- [Celery](#celery-)
- [Тестирование](#тестирование)
- [Deployment & CI/CD](#deployment--cicd)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Автор](#автор)

## Технологии
### Backend
- Python 3.13
- Django 5.x
- Django REST Framework
- Celery 5.x
- PostgreSQL
- Redis

### Frontend
- Next.js
- React
- TypeScript

### Инфраструктура
- Docker / Docker Compose
- Nginx
- CI/CD (GitHub Actions)

## Использование

**Клонирование репозитория**
```bash
git clone https://github.com/kshaab/VostKrep
cd VostKrep
```

**Бэкенд**

```bash
cd backend
```

Установка зависимостей: 
```bash
poetry install
poetry shell
````

Миграции: 
```bash
python manage.py migrate
````

Запуск сервера: 
```bash
python manage.py runserver
```

**Фронтенд**

```bash
cd frontend
```

Установка зависимостей:
```bash
npm install
```

Запуск dev-сервера: 
```bash
npm run dev
```

## Структура проекта

### backend/src/project/
Основной пакет проекта с конфигурацией Django.

- settings.py — настройки проекта
- urls.py — маршрутизация
- celery.py — конфигурация Celery
- asgi.py / wsgi.py — точки входа

Приложения

- apps/order — заявки и заказы
- apps/products — товары и категории
- apps/pages — статические страницы


### frontend/
Фронтенд-приложение на Next.js.

- src/ — исходный код приложения
- public/ — статические файлы
- next.config.ts — конфигурация Next.js

## Зависимости
Управление зависимостями осуществляется через Poetry (pyproject.toml).

Основные зависимости:
- Django 5.x
- Celery 5.x
- PostgreSQL
- Redis (для Celery)

## Celery 
Проект использует Celery для фоновых задач:
- отправка заявок в Telegram-бот

## Тестирование
Запуск тестов:
```bash
poetry run python manage.py test project.apps
```

Запуска теста отдельного приложения(пример): 
```bash
poetry run python manage.py test project.apps.order
```

## Deployment
1. Подключение к серверу 
```bash
ssh user@your-server-ip
```
2. Установка Docker и Docker Compose
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
```
Проверка установки:
```bash
docker --version
docker compose version
```
3. Клонирование проекта
```bash
git clone https://github.com/kshaab/VostKrep
cd VostKrep
```
4. Создание .env
```bash
DEBUG=True
ALLOWED_HOSTS=*

POSTGRES_DB=db_name
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

SECRET_KEY=your_secret_key
```
5. Запуск проекта
```bash
docker compose up -d --build
```
Проверка запуска: 
```bash
docker compose ps
```

Сайт:
```cpp
https://vostkrep.ru
```

Админ-панель:
```cpp
https://vostkrep.ru/admin
```

## GitHub Actions CI/CD
Workflow:
```bash
.github/workflows/
```

Pipeline автоматически выполняется при push:

1. Checkout репозитория
2. Установка зависимостей
3. Запуск тестов
4. Подключение к серверу по SSH
5. Pull изменений
6. Пересборка контейнеров
7. Перезапуск сервиса

## Автор
[Ксения](https://github.com/kshaab)