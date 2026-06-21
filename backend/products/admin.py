from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "category", "created_at")
    search_fields = ("name", "company__name")
    list_filter = ("company", "category")
