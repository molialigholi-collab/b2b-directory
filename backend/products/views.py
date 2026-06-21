from rest_framework import filters, viewsets

from .models import Product
from .permissions import IsStaffOrReadOnly
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("company", "category")
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    permission_classes = [IsStaffOrReadOnly]
    search_fields = ["name", "description", "company__name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")

        if category:
            queryset = queryset.filter(category__slug=category)

        return queryset
