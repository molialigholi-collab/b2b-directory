from django.contrib import admin

from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "created_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "company__name")
    list_filter = ("company",)
