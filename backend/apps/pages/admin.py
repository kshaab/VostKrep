from django.contrib import admin
from .models import DeliveryPage, DeliveryItem



class DeliveryItemInline(admin.TabularInline):
    model = DeliveryItem
    extra = 1
    fields = ("text", "order")
    sortable_field_name = "order"


@admin.register(DeliveryPage)
class DeliveryPageAdmin(admin.ModelAdmin):
    list_display = ("title",)
    inlines = [DeliveryItemInline]



