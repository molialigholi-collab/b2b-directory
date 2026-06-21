from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.SlugField(source="category.slug", read_only=True)

    class Meta:
        model = Company
        fields = [
            "id",
            "category",
            "category_name",
            "category_slug",
            "name",
            "slug",
            "description",
            "logo",
            "website",
            "phone",
            "email",
            "created_at",
        ]
