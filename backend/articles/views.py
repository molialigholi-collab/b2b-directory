from rest_framework import viewsets

from .models import Article
from .serializers import ArticleSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.select_related("company")
    serializer_class = ArticleSerializer
    lookup_field = "slug"
