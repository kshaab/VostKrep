from django.contrib import admin
from .models import Order, OrderItem

# Товары в админке в виде таблицы внутри заказа
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ("product_name", "quantity", "price")

# Админка для просмотра полного заказа
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "email", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "phone", "email")
    date_hierarchy = "created_at"

    inlines = [OrderItemInline]

    readonly_fields = ("created_at",)
