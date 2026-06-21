from django.db import models

from categories.models import Category
from companies.models import Company
from users.models import User


class RFQ(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        REVIEWED = "reviewed", "Reviewed"
        MATCHED = "matched", "Matched"
        CLOSED = "closed", "Closed"

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name="rfqs", blank=True, null=True)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=50)
    destination_country = models.CharField(max_length=120)
    destination_city = models.CharField(max_length=120, blank=True)
    buyer_name = models.CharField(max_length=255)
    buyer_email = models.EmailField()
    buyer_phone = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class RFQResponse(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Submitted"
        SHORTLISTED = "shortlisted", "Shortlisted"
        REJECTED = "rejected", "Rejected"

    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name="responses")
    supplier = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="rfq_responses")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rfq_responses")
    message = models.TextField()
    proposed_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=10, blank=True)
    delivery_time = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["rfq", "supplier"], name="unique_supplier_response_per_rfq"),
        ]

    def __str__(self):
        return f"{self.supplier} response to {self.rfq}"
