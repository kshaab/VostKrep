from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/orders/", include("project.apps.order.urls")),
    path("api/products/", include("project.apps.products.urls")),
    path("api/", include("project.apps.pages.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)