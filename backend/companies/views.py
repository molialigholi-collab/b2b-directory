from rest_framework import filters, viewsets

from .models import Company
from .permissions import IsCompanyOwnerOrStaffWriteOnly
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.select_related("category", "owner")
    serializer_class = CompanySerializer
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter]
    permission_classes = [IsCompanyOwnerOrStaffWriteOnly]
    search_fields = ["name", "description", "email", "website"]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")

        if category:
            queryset = queryset.filter(category__slug=category)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
