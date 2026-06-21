from django.urls import path

from .views import MyCompanyView, MyProductDetailView, MyProductListCreateView, MyRFQResponseListView

urlpatterns = [
    path("my-company/", MyCompanyView.as_view(), name="dashboard-my-company"),
    path("my-products/", MyProductListCreateView.as_view(), name="dashboard-my-products"),
    path("my-products/<int:pk>/", MyProductDetailView.as_view(), name="dashboard-my-product-detail"),
    path("rfq-responses/", MyRFQResponseListView.as_view(), name="dashboard-rfq-responses"),
]
