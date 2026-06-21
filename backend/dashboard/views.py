from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import Company
from products.models import Product

from .serializers import DashboardCompanySerializer, DashboardProductSerializer


def get_owned_company(user):
    return Company.objects.filter(owner=user).select_related("category").first()


class MyCompanyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        company = get_owned_company(request.user)

        if not company:
            return Response({
                "company": None,
                "detail": "No company is assigned to this account yet.",
            })

        return Response({"company": DashboardCompanySerializer(company).data})

    def patch(self, request):
        company = get_owned_company(request.user)

        if not company:
            return Response({
                "company": None,
                "detail": "No company is assigned to this account yet.",
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = DashboardCompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"company": serializer.data})


class MyProductListCreateView(generics.ListCreateAPIView):
    serializer_class = DashboardProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_company(self):
        return get_owned_company(self.request.user)

    def get_queryset(self):
        company = self.get_company()

        if not company:
            return Product.objects.none()

        return Product.objects.filter(company=company).select_related("company", "category")

    def list(self, request, *args, **kwargs):
        company = self.get_company()

        if not company:
            return Response({
                "company": None,
                "products": [],
                "detail": "No company is assigned to this account yet.",
            })

        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({
            "company": DashboardCompanySerializer(company).data,
            "products": serializer.data,
        })

    def perform_create(self, serializer):
        company = self.get_company()

        if not company:
            raise PermissionError("No company is assigned to this account yet.")

        serializer.save(company=company)

    def create(self, request, *args, **kwargs):
        if not self.get_company():
            return Response({
                "detail": "No company is assigned to this account yet.",
            }, status=status.HTTP_403_FORBIDDEN)

        return super().create(request, *args, **kwargs)


class MyProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DashboardProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        company = get_owned_company(self.request.user)

        if not company:
            return Product.objects.none()

        return Product.objects.filter(company=company).select_related("company", "category")

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
