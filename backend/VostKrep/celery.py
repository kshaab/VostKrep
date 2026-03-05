from __future__ import absolute_import, unicode_literals

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "VostKrep.settings")

app = Celery("VostKrep")

app.config_from_object("VostKrep.settings", namespace="CELERY")

app.autodiscover_tasks()