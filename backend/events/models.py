from django.db import models
from django.utils.text import slugify

from companies.models import Company


class Event(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True)
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["event_date"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "event"
            slug = base_slug
            counter = 1

            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)