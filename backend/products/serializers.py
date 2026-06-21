from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_slug = serializers.SlugField(source="company.slug", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "company",
            "company_name",
            "company_slug",
            "name",
            "description",
            "image",
            "created_at",
        ]
