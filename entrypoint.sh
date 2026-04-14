#!/bin/sh
set -e

PROJECT_DIR=/project/backend/

SRC_DIR=/project/backend/src

export PYTHONPATH=$PROJECT_DIR:$SRC_DIR

echo "Применяем миграции..."
python $PROJECT_DIR/manage.py migrate

echo "Собираем статические файлы..."
python $PROJECT_DIR/manage.py collectstatic --noinput

echo "Запускаем Gunicorn..."
exec gunicorn project.wsgi:application --chdir $SRC_DIR --bind 0.0.0.0:8000 --workers 3
