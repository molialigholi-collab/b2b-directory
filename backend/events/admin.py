from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "event_date", "location", "created_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "company__name", "location")
    list_filter = ("company", "event_date")
