from rest_framework import serializers

from .models import RFQ, RFQResponse


class PublicRFQSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.SlugField(source="category.slug", read_only=True)

    class Meta:
        model = RFQ
        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "category_slug",
            "quantity",
            "unit",
            "destination_country",
            "destination_city",
            "status",
            "created_at",
        ]


class CreateRFQSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQ
        fields = [
            "id",
            "title",
            "description",
            "category",
            "quantity",
            "unit",
            "destination_country",
            "destination_city",
            "buyer_name",
            "buyer_email",
            "buyer_phone",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_title(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters.")
        return value

    def validate_description(self, value):
        value = value.strip()
        if len(value) < 20:
            raise serializers.ValidationError("Description must be at least 20 characters.")
        return value

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value

    def validate(self, attrs):
        # Future production hardening: add captcha, abuse detection, and IP/user
        # rate limits before accepting high-volume public RFQ traffic.
        return attrs


class RFQResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQResponse
        fields = [
            "id",
            "rfq",
            "supplier",
            "user",
            "message",
            "proposed_price",
            "currency",
            "delivery_time",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "rfq", "supplier", "user", "status", "created_at"]

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value

    def validate_currency(self, value):
        return value.strip().upper()

    def validate(self, attrs):
        # Future production hardening: add captcha/rate-limit checks before
        # allowing high-volume supplier submissions.
        return attrs


class DashboardRFQResponseSerializer(serializers.ModelSerializer):
    rfq_title = serializers.CharField(source="rfq.title", read_only=True)
    rfq_status = serializers.CharField(source="rfq.status", read_only=True)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = RFQResponse
        fields = [
            "id",
            "rfq",
            "rfq_title",
            "rfq_status",
            "supplier",
            "supplier_name",
            "message",
            "proposed_price",
            "currency",
            "delivery_time",
            "status",
            "created_at",
        ]
