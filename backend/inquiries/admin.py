from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "company", "product", "status", "created_at")
    list_filter = ("status", "created_at", "company", "product")
    search_fields = ("name", "email", "phone", "message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    actions = ("mark_as_contacted", "mark_as_closed")

    @admin.action(description="Mark selected inquiries as contacted")
    def mark_as_contacted(self, request, queryset):
        queryset.update(status=Inquiry.Status.CONTACTED)

    @admin.action(description="Mark selected inquiries as closed")
    def mark_as_closed(self, request, queryset):
        queryset.update(status=Inquiry.Status.CLOSED)
