from django.db import models
from django.utils.text import slugify

from companies.models import Company


class Article(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="articles")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    content = models.TextField()
    image = models.ImageField(upload_to="articles/images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "article"
            slug = base_slug
            counter = 1

            while Article.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)