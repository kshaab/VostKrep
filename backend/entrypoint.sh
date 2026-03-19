#!/bin/sh
set -e

echo "Применяем миграции..."
python /project/backend/manage.py migrate

echo "Собираем статические файлы..."
python /project/backend/manage.py collectstatic --noinput

echo "Запускаем Gunicorn..."
exec gunicorn src.project.wsgi:application --bind 0.0.0.0:8000 --workers 3