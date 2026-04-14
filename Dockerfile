FROM python:3.12-slim

WORKDIR /project

# Системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Poetry
RUN pip install --upgrade pip poetry
RUN poetry config virtualenvs.create false

# Копируем pyproject.toml и poetry.lock
COPY pyproject.toml poetry.lock /project/

# Устанавливаем зависимости
RUN poetry install --no-interaction --no-ansi --no-root

# Копируем весь backend, включая manage.py
COPY backend /project/backend

# Копируем entrypoint и делаем исполняемым
COPY entrypoint.sh /project/entrypoint.sh
RUN chmod +x /project/entrypoint.sh

# PYTHONPATH
ENV PYTHONPATH=/project/backend/src

# Статика и медиа
RUN mkdir -p /project/static /project/media

EXPOSE 8000

# Entry point
ENTRYPOINT ["/project/entrypoint.sh"]
