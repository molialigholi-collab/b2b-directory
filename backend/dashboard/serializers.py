from rest_framework import serializers

from companies.models import Company
from products.models import Product


class DashboardCompanySerializer(serializers.ModelSerializer):
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
            "website",
            "phone",
            "email",
            "created_at",
        ]
        read_only_fields = ["id", "category", "category_name", "category_slug", "slug", "created_at"]


class DashboardProductSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_slug = serializers.SlugField(source="company.slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.SlugField(source="category.slug", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "company",
            "company_name",
            "company_slug",
            "category",
            "category_name",
            "category_slug",
            "name",
            "description",
            "image",
            "created_at",
        ]
        read_only_fields = ["id", "company", "company_name", "company_slug", "category_name", "category_slug", "image", "created_at"]
