from django.db import models

from companies.models import Company


class Event(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["event_date"]

    def __str__(self):
        return self.title
