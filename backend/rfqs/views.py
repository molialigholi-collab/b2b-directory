from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from dashboard.views import get_owned_company

from .models import RFQ, RFQResponse
from .serializers import CreateRFQSerializer, PublicRFQSerializer, RFQResponseCreateSerializer


class RFQListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return RFQ.objects.filter(status__in=[RFQ.Status.REVIEWED, RFQ.Status.MATCHED]).select_related("category")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateRFQSerializer

        return PublicRFQSerializer


class RFQRespondView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        company = get_owned_company(request.user)

        if not company:
            return Response({
                "detail": "Only authenticated users with an assigned company can respond to RFQs.",
            }, status=status.HTTP_403_FORBIDDEN)

        rfq = generics.get_object_or_404(
            RFQ,
            pk=pk,
            status__in=[RFQ.Status.REVIEWED, RFQ.Status.MATCHED],
        )

        if RFQResponse.objects.filter(rfq=rfq, supplier=company).exists():
            return Response({
                "detail": "Your company has already submitted a response for this RFQ.",
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = RFQResponseCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(rfq=rfq, supplier=company, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
