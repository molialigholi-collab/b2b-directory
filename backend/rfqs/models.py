from django.db import models

from categories.models import Category


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

# Create your models here.
