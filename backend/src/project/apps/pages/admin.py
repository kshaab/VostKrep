from django.contrib import admin

from .models import DeliveryItem, DeliveryPage, StaticPage, StaticPageItem, StaticPageSection


class DeliveryItemInline(admin.TabularInline):
    model = DeliveryItem
    extra = 1
    fields = ("title", "text", "order")
    sortable_field_name = "order"


@admin.register(DeliveryPage)
class DeliveryPageAdmin(admin.ModelAdmin):
    list_display = ("title",)
    inlines = [DeliveryItemInline]


class StaticPageItemInline(admin.TabularInline):
    model = StaticPageItem
    extra = 1
    ordering = ["order"]


@admin.register(StaticPageSection)
class StaticPageSectionAdmin(admin.ModelAdmin):
    list_display = ["title", "page", "order"]
    inlines = [StaticPageItemInline]


class StaticPageSectionInline(admin.StackedInline):
    model = StaticPageSection
    extra = 1
    ordering = ["order"]


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = ["title", "slug"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [StaticPageSectionInline]
