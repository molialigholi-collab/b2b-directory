from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "company", "product", "status", "created_at")
    list_filter = ("status", "company", "product", "created_at")
    search_fields = ("name", "email", "phone", "message", "source_page", "company__name", "product__name")
    readonly_fields = ("created_at",)

# Register your models here.
