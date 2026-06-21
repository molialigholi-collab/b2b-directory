from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from articles.views import ArticleViewSet
from categories.views import CategoryViewSet
from companies.views import CompanyViewSet
from events.views import EventViewSet
from inquiries.views import InquiryCreateView
from products.views import ProductViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"companies", CompanyViewSet)
router.register(r"products", ProductViewSet)
router.register(r"articles", ArticleViewSet)
router.register(r"events", EventViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/inquiries/", InquiryCreateView.as_view(), name="inquiry-create"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
