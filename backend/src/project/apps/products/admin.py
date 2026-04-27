from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import Category, Product, ProductOption, ProductColor
from .resources import ProductResource


class ProductOptionInline(admin.TabularInline):
    model = ProductOption
    extra = 1
    fields = ("size", "sku", "is_active")
    readonly_fields = ()
    show_change_link = True


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = ("color_name",)
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
    inlines = [ProductOptionInline, ProductColorInline]
    ordering = ("category", "name")
