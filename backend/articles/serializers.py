from rest_framework import serializers

from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_slug = serializers.SlugField(source="company.slug", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "company",
            "company_name",
            "company_slug",
            "title",
            "slug",
            "content",
            "image",
            "created_at",
        ]
