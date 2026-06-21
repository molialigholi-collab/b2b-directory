from rest_framework import generics, permissions

from .models import RFQ
from .serializers import CreateRFQSerializer, PublicRFQSerializer


class RFQListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return RFQ.objects.filter(status__in=[RFQ.Status.REVIEWED, RFQ.Status.MATCHED]).select_related("category")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateRFQSerializer

        return PublicRFQSerializer

# Create your views here.
