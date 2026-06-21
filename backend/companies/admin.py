from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "email", "website", "created_at")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "email")
    list_filter = ("category",)
