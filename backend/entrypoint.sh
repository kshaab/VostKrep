set -e

# Применяем миграции
python manage.py migrate

# Собираем статические файлы
python manage.py collectstatic --noinput

# Запускаем gunicorn
exec gunicorn project.wsgi:application --bind 0.0.0.0:8000 --workers 3