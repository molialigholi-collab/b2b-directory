from django.db import models

from companies.models import Company
from products.models import Product


class Inquiry(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        CLOSED = "closed", "Closed"

    company = models.ForeignKey(Company, on_delete=models.SET_NULL, related_name="inquiries", blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, related_name="inquiries", blank=True, null=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    message = models.TextField()
    source_page = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.email}"

# Create your models here.
