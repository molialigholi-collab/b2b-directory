from django.db import models

from companies.models import Company


class Article(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="articles")
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to="articles/images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
