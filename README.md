# VostKrep

### Веб-сайт каталог для поставщика крепежа, разработанный на **Django** + **Next.js**.  

### Проект в разработке.

## Содержание 

- [Использование](#использование)
- [Структура проекта](#структура-проекта)
- [Зависимости](#зависимости)
- [Celery](#celery-)
- [Технологии](#технологии)
- [Тестирование](#тестирование)
- [Deployment & CI/CD](#deployment--cicd)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Автор](#автор)


## Использование
**Бэкенд**

Перейдите в папку бэкенда:
```bash
cd backend
```

Клонируйте репозиторий: 
```bash
git clone https://github.com/kshaab/VostKrep
cd VostKrep
```
Установите зависимости и активируйте виртуальное окружение: 
poetry install
poetry shell

Примените миграции: 
python manage.py migrate

Запустите сервер разработки: 
python manage.py runserver

**Фронтенд**

Перейдите в папку фронтенда:
```bash
cd frontend
```

Установите зависимости:
npm install

Запустите фронтенд:
npm run dev

## Структура проекта

### backend/src/project/
Основной пакет проекта с конфигурацией Django.

#### settings.py
Настройки проекта.

#### urls.py
Маршрутизация URL.

#### asgi.py / wsgi.py
Точки входа для ASGI/WSGI серверов.

#### celery.py
Конфигурация Celery.

---

### backend/src/project/apps/order/
Приложение для работы с заявками: модели, сериализаторы, вьюсеты, задачи Celery.

---

### backend/src/project/apps/pages/
Приложение для работы со статическими страницами.

### backend/src/project/apps/products/
Приложение для работы с товарами и категориями: модели, сериализаторы, вьюсеты.

---

### frontend/
Фронтенд-приложение на Next.js.

#### src/
Исходный код приложения (компоненты, страницы, логика).

#### public/
Статические файлы.

#### package.json
Зависимости и скрипты.

#### next.config.ts
Конфигурация Next.js.

## Зависимости
Управление зависимостями осуществляется через Poetry (pyproject.toml).
Основные зависимости:
- Django 5.x
- Celery 5.x
- PostgreSQL
- Redis (для Celery)

## Celery 
Проект использует Celery для фоновых задач:
- Отправка заявок в телеграм-бот. 


## Тестирование
Запуск тестов:
```bash
poetry run python manage.py test project.apps
```

Запуска теста отдельного приложения(пример): 
```bash
poetry run python manage.py test project.apps.order
```

## Deployment & CI/CD
1. Подключение к серверу по SSH
```bash
ssh user@SERVER_IP
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

POSTGRES_DB=habits_tracker
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

Проверка приложения по адресу:
```cpp
http://89.169.160.28:8000
```
## GitHub Actions CI/CD
Workflow:
```bash
.github/workflows/
```

Workflow запускается автоматически при каждом push в репозиторий.

Этапы workflow:
1. Клонирование репозитория
2. Установка зависимостей
3. Запуск тестов (деплой выполняется только при успешном прохождении тестов.)
4. Подключение к серверу по SSH
5. Pull последних изменений
6. Пересборка контейнеров
7. Перезапуск приложения

## Технологии
- Python 3.13

- Django 5.x

- Django REST Framework 4.x

- PostgreSQL

- Redis 

- Celery 5.x

- Next.js

## Автор
[Ксения](https://github.com/kshaab)