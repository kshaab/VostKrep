from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import Category, Product, ProductOption
from .resources import ProductResource


class ProductOptionInline(admin.TabularInline):
    model = ProductOption
    extra = 1
    fields = ("size", "sku", "color", "color_name", "image", "is_active")
    readonly_fields = ()
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    list_display = ("id", "name", "parent", "is_active")
    list_filter = ("is_active", "parent")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("parent", "name")


@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_class = ProductResource
    list_display = ("id", "name", "sku", "category", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name", "sku")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductOptionInline]
    ordering = ("category", "name")
