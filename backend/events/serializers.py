from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_slug = serializers.SlugField(source="company.slug", read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "company",
            "company_name",
            "company_slug",
            "title",
            "slug",
            "description",
            "event_date",
            "location",
            "created_at",
        ]
