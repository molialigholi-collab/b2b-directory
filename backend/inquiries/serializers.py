from rest_framework import serializers

from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            "id",
            "company",
            "product",
            "name",
            "email",
            "phone",
            "message",
            "source_page",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate(self, attrs):
        if not attrs.get("company") and not attrs.get("product"):
            raise serializers.ValidationError("An inquiry must be linked to a company or product.")

        # Future production hardening: add captcha, IP throttling, and rate-limit checks here.
        return attrs

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value
