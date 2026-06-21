from rest_framework import generics, permissions

from .models import Inquiry
from .serializers import InquirySerializer


class InquiryCreateView(generics.CreateAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.AllowAny]

    # Public endpoint is intentionally POST-only. Do not expose inquiry lists until
    # staff-only permissions, captcha, throttling, and audit logging are in place.

# Create your views here.
