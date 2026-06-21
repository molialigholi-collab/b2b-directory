from django.contrib import admin

from .models import RFQ, RFQResponse


@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "quantity", "unit", "destination_country", "status", "created_at")
    list_filter = ("status", "category", "destination_country", "created_at")
    search_fields = ("title", "description", "buyer_name", "buyer_email", "buyer_phone", "destination_country", "destination_city")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    actions = ("mark_as_reviewed", "mark_as_matched", "mark_as_closed")

    @admin.action(description="Mark selected RFQs as reviewed")
    def mark_as_reviewed(self, request, queryset):
        queryset.update(status=RFQ.Status.REVIEWED)

    @admin.action(description="Mark selected RFQs as matched")
    def mark_as_matched(self, request, queryset):
        queryset.update(status=RFQ.Status.MATCHED)

    @admin.action(description="Mark selected RFQs as closed")
    def mark_as_closed(self, request, queryset):
        queryset.update(status=RFQ.Status.CLOSED)


@admin.register(RFQResponse)
class RFQResponseAdmin(admin.ModelAdmin):
    list_display = ("rfq", "supplier", "user", "status", "proposed_price", "currency", "created_at")
    list_filter = ("status", "created_at", "supplier", "rfq")
    search_fields = ("rfq__title", "supplier__name", "user__username", "message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    actions = ("mark_as_shortlisted", "mark_as_rejected")

    @admin.action(description="Mark selected responses as shortlisted")
    def mark_as_shortlisted(self, request, queryset):
        queryset.update(status=RFQResponse.Status.SHORTLISTED)

    @admin.action(description="Mark selected responses as rejected")
    def mark_as_rejected(self, request, queryset):
        queryset.update(status=RFQResponse.Status.REJECTED)
