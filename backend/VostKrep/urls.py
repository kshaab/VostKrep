from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/orders/", include("apps.order.urls")),
    path("api/products/", include("apps.products.urls")),
    path("api/pages/", include("apps.pages.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)