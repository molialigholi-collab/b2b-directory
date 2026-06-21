from rest_framework import filters, viewsets

from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description", "email", "website"]
